import { addRangeToSelection } from '../../coreApi/setDOMSelection/addRangeToSelection';
import { adjustImageSelectionOnSafari } from './utils/adjustImageSelectionOnSafari';
import { deleteEmptyList } from './utils/deleteEmptyList';
import { onCreateCopyEntityNode } from '../../override/pasteCopyBlockEntityParser';
import { paste } from '../../command/paste/paste';
import {
    ChangeSource,
    contentModelToDom,
    createModelToDomContext,
    deleteSelection,
    extractClipboardItems,
    getSelectedCells,
    isElementOfType,
    isNodeOfType,
    iterateSelections,
    moveChildNodes,
    normalizeContentModel,
    toArray,
    wrap,
} from 'roosterjs-content-model-dom';
import type {
    ClipboardData,
    CopyPastePluginState,
    ContentModelTable,
    DOMSelection,
    IEditor,
    OnNodeCreated,
    EditorOptions,
    PluginWithState,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegment,
    ReadonlyTableSelectionContext,
} from 'roosterjs-content-model-types';

const TEMP_DIV_ID = 'roosterJS_copyCutTempDiv';

/**
 * Copy and paste plugin for handling onCopy and onPaste event
 */
class CopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: IEditor | null = null;
    private disposer: (() => void) | null = null;
    private state: CopyPastePluginState;
    private customCopyCutEnabled: boolean = false;

    /**
     * Construct a new instance of CopyPastePlugin
     * @param option The editor option
     */
    constructor(option: EditorOptions) {
        this.state = {
            allowedCustomPasteType: option.allowedCustomPasteType || [],
            tempDiv: null,
            defaultPasteType: option.defaultPasteType,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'CopyPaste';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.attachDomEvent({
            paste: {
                beforeDispatch: e => this.onPaste(e),
            },
            copy: {
                beforeDispatch: e => this.onCutCopy(e, false /*isCut*/),
            },
            cut: {
                beforeDispatch: e => this.onCutCopy(e, true /*isCut*/),
            },
        });
        this.customCopyCutEnabled = editor.isExperimentalFeatureEnabled('CustomCopyCut');
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        if (this.state.tempDiv) {
            this.state.tempDiv.parentNode?.removeChild(this.state.tempDiv);
            this.state.tempDiv = null;
        }

        if (this.disposer) {
            this.disposer();
        }
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    private onCutCopy(event: Event, isCut: boolean) {
        if (!this.editor) {
            return;
        }

        const doc = this.editor.getDocument();
        const selection = this.editor.getDOMSelection();

        adjustImageSelectionOnSafari(this.editor, selection);

        if (selection && (selection.type != 'range' || !selection.range.collapsed)) {
            const pasteModel = this.editor.getContentModelCopy('disconnected');

            if (selection.type === 'table') {
                iterateSelections(pasteModel, (_, tableContext) => {
                    if (tableContext?.table) {
                        preprocessTable(tableContext.table);

                        return true;
                    }
                    return false;
                });
            } else if (selection.type === 'range') {
                adjustSelectionForCopyCut(pasteModel);
            }

            const tempDiv = this.getTempDiv(this.editor.getDocument());
            const context = createModelToDomContext(undefined /* editorContext */);

            context.onNodeCreated = onNodeCreated;

            const selectionForCopy = contentModelToDom(
                tempDiv.ownerDocument,
                tempDiv,
                pasteModel,
                context
            );

            let newRange: Range | null = selectionForCopy
                ? domSelectionToRange(doc, selectionForCopy)
                : null;

            if (newRange) {
                newRange = this.editor.triggerEvent('beforeCutCopy', {
                    clonedRoot: tempDiv,
                    range: newRange,
                    rawEvent: event as ClipboardEvent,
                    isCut,
                }).range;

                if (this.customCopyCutEnabled && isClipboardEvent(event)) {
                    event.preventDefault();
                    const contents = newRange.extractContents();
                    moveChildNodes(tempDiv, contents);
                    event.clipboardData?.setData('text/html', tempDiv.innerHTML);
                    event.clipboardData?.setData('text/plain', tempDiv.innerText);
                } else if (newRange) {
                    addRangeToSelection(doc, newRange);
                }

                doc.defaultView?.requestAnimationFrame(() => {
                    if (!this.editor) {
                        return;
                    }

                    cleanUpAndRestoreSelection(tempDiv);
                    this.editor.setDOMSelection(selection);
                    this.editor.focus();

                    if (isCut) {
                        this.editor.formatContentModel(
                            (model, context) => {
                                if (
                                    deleteSelection(model, [deleteEmptyList], context)
                                        .deleteResult == 'range'
                                ) {
                                    normalizeContentModel(model);
                                }

                                return true;
                            },
                            {
                                apiName: 'cut',
                                changeSource: ChangeSource.Cut,
                            }
                        );
                    }
                });
            } else {
                cleanUpAndRestoreSelection(tempDiv);
            }
        }
    }

    private onPaste = (event: Event) => {
        if (this.editor && isClipboardEvent(event)) {
            const editor = this.editor;

            const dataTransfer = event.clipboardData;

            if (shouldPreventDefaultPaste(dataTransfer, editor)) {
                event.preventDefault();
                extractClipboardItems(
                    toArray(dataTransfer!.items),
                    this.state.allowedCustomPasteType
                ).then((clipboardData: ClipboardData) => {
                    if (!editor.isDisposed()) {
                        paste(editor, clipboardData, this.state.defaultPasteType);
                    }
                });
            }
        }
    };

    private getTempDiv(doc: Document) {
        if (!this.state.tempDiv) {
            const tempDiv = doc.createElement('div');

            tempDiv.style.width = '600px';
            tempDiv.style.height = '1px';
            tempDiv.style.overflow = 'hidden';
            tempDiv.style.position = 'fixed';
            tempDiv.style.top = '0';
            tempDiv.style.left = '0';
            tempDiv.style.userSelect = 'text';
            tempDiv.contentEditable = 'true';

            if (!this.customCopyCutEnabled) {
                doc.body.appendChild(tempDiv);
            }

            this.state.tempDiv = tempDiv;
        }

        const div = this.state.tempDiv;

        div.style.backgroundColor = 'white';
        div.style.color = 'black';
        div.childNodes.forEach(node => div.removeChild(node));

        div.style.display = '';
        div.id = TEMP_DIV_ID;
        div.focus();

        return div;
    }
}
/**
 * @internal
 * Exported only for unit testing
 */
export function adjustSelectionForCopyCut(pasteModel: ContentModelDocument) {
    let selectionMarker: ContentModelSegment | undefined;
    let firstBlock: ContentModelParagraph | undefined;
    let tableContext: ReadonlyTableSelectionContext | undefined;

    iterateSelections(pasteModel, (_, tableCtxt, block, segments) => {
        if (selectionMarker) {
            if (tableCtxt != tableContext && firstBlock?.segments.includes(selectionMarker)) {
                firstBlock.segments.splice(firstBlock.segments.indexOf(selectionMarker), 1);
            }
            return true;
        }

        const marker = segments?.find(segment => segment.segmentType == 'SelectionMarker');
        if (!selectionMarker && marker) {
            tableContext = tableCtxt;
            firstBlock = block?.blockType == 'Paragraph' ? block : undefined;
            selectionMarker = marker;
        }

        return false;
    });
}

function cleanUpAndRestoreSelection(tempDiv: HTMLDivElement) {
    tempDiv.style.backgroundColor = '';
    tempDiv.style.color = '';
    tempDiv.style.display = 'none';
    moveChildNodes(tempDiv);
}

function isClipboardEvent(event: Event): event is ClipboardEvent {
    return !!(event as ClipboardEvent).clipboardData;
}

function domSelectionToRange(doc: Document, selection: DOMSelection): Range | null {
    let newRange: Range | null = null;

    if (selection.type === 'table') {
        const table = selection.table;
        const elementToSelect =
            table.parentElement?.childElementCount == 1 ? table.parentElement : table;

        newRange = doc.createRange();
        newRange.selectNode(elementToSelect);
    } else if (selection.type === 'image') {
        newRange = doc.createRange();
        newRange.selectNode(selection.image);
    } else {
        newRange = selection.range;
    }

    return newRange;
}

/**
 * @internal
 * Exported only for unit testing
 */
export const onNodeCreated: OnNodeCreated = (modelElement, node): void => {
    if (isNodeOfType(node, 'ELEMENT_NODE') && isElementOfType(node, 'table')) {
        wrap(node.ownerDocument, node, 'div');
    }
    if (isNodeOfType(node, 'ELEMENT_NODE') && !node.isContentEditable) {
        node.removeAttribute('contenteditable');
    }
    onCreateCopyEntityNode(modelElement, node);
};

/**
 * @internal
 * Exported only for unit testing
 */
export function preprocessTable(table: ContentModelTable) {
    const sel = getSelectedCells(table);
    table.rows = table.rows
        .map(row => {
            return {
                ...row,
                cells: row.cells.filter(cell => cell.isSelected),
            };
        })
        .filter(row => row.cells.length > 0);

    delete table.format.width;

    table.widths = sel
        ? table.widths.filter((_, index) => index >= sel?.firstColumn && index <= sel?.lastColumn)
        : [];
}

/**
 * @internal
 * Exported only for unit testing
 */
export function shouldPreventDefaultPaste(
    dataTransfer: DataTransfer | null,
    editor: IEditor
): boolean {
    if (!dataTransfer?.items) {
        return false;
    }

    if (!editor.getEnvironment().isAndroid) {
        return true;
    }

    // On Android, the clipboard data from Office apps is a file, which can't be loaded
    // so we have to allow the default browser behavior
    return toArray(dataTransfer.items).some(item => {
        const { type } = item;
        const isNormalFile = item.kind === 'file' && type !== '';
        const isText = type.indexOf('text/') === 0;
        return isNormalFile || isText;
    });
}

/**
 * @internal
 * Create a new instance of CopyPastePlugin
 * @param option The editor option
 */
export function createCopyPastePlugin(
    option: EditorOptions
): PluginWithState<CopyPastePluginState> {
    return new CopyPastePlugin(option);
}
