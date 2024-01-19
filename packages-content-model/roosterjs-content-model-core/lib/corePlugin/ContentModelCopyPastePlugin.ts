import { addRangeToSelection } from './utils/addRangeToSelection';
import { ChangeSource } from '../constants/ChangeSource';
import { cloneModel } from '../publicApi/model/cloneModel';
import { deleteEmptyList } from './utils/deleteEmptyList';
import { deleteSelection } from '../publicApi/selection/deleteSelection';
import { extractClipboardItems } from '../utils/extractClipboardItems';
import { getSelectedCells } from '../publicApi/table/getSelectedCells';
import { iterateSelections } from '../publicApi/selection/iterateSelections';
import { transformColor } from '../publicApi/color/transformColor';
import {
    contentModelToDom,
    createModelToDomContext,
    isElementOfType,
    isNodeOfType,
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
    IStandaloneEditor,
    OnNodeCreated,
    StandaloneEditorOptions,
    PluginWithState,
    ContentModelDocument,
    ContentModelParagraph,
    TableSelectionContext,
    ContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Copy and paste plugin for handling onCopy and onPaste event
 */
class ContentModelCopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: IStandaloneEditor | null = null;
    private disposer: (() => void) | null = null;
    private state: CopyPastePluginState;

    /**
     * Construct a new instance of CopyPastePlugin
     * @param option The editor option
     */
    constructor(option: StandaloneEditorOptions) {
        this.state = {
            allowedCustomPasteType: option.allowedCustomPasteType || [],
            tempDiv: null,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ContentModelCopyPaste';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IStandaloneEditor) {
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

        if (selection && (selection.type != 'range' || !selection.range.collapsed)) {
            const model = this.editor.createContentModel(undefined /* option */, selection);
            const cacheProcessor = this.editor.isDarkMode() ? this.processEntityColor : false;

            const pasteModel = cloneModel(model, {
                includeCachedElement: cacheProcessor,
            });

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
            const selectionForCopy = contentModelToDom(
                tempDiv.ownerDocument,
                tempDiv,
                pasteModel,
                createModelToDomContext(),
                onNodeCreated
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

                if (newRange) {
                    addRangeToSelection(doc, newRange);
                }

                doc.defaultView?.requestAnimationFrame(() => {
                    if (!this.editor) {
                        return;
                    }

                    cleanUpAndRestoreSelection(tempDiv);
                    this.editor.focus();
                    this.editor.setDOMSelection(selection);

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

            if (dataTransfer?.items) {
                event.preventDefault();
                extractClipboardItems(
                    toArray(dataTransfer.items),
                    this.state.allowedCustomPasteType
                ).then((clipboardData: ClipboardData) => {
                    if (!editor.isDisposed()) {
                        editor.pasteFromClipboard(clipboardData);
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

            doc.body.appendChild(tempDiv);

            this.state.tempDiv = tempDiv;
        }

        const div = this.state.tempDiv;

        div.style.backgroundColor = 'white';
        div.style.color = 'black';
        div.childNodes.forEach(node => div.removeChild(node));

        div.style.display = '';
        div.focus();

        return div;
    }

    private processEntityColor = (
        node: HTMLElement,
        type: 'general' | 'entity' | 'cache'
    ): HTMLElement | undefined => {
        if (type == 'cache' || !this.editor) {
            return undefined;
        }

        const result = node.cloneNode(true /*deep*/) as HTMLElement;
        const colorHandler = this.editor.getColorManager();

        transformColor(result, true /*includeSelf*/, 'darkToLight', colorHandler);

        result.style.color = result.style.color || 'inherit';
        result.style.backgroundColor = result.style.backgroundColor || 'inherit';

        return result;
    };
}

/**
 * @internal
 * Exported only for unit testing
 */
export function adjustSelectionForCopyCut(pasteModel: ContentModelDocument) {
    let selectionMarker: ContentModelSegment | undefined;
    let firstBlock: ContentModelParagraph | undefined;
    let tableContext: TableSelectionContext | undefined;

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
export const onNodeCreated: OnNodeCreated = (_, node): void => {
    if (isNodeOfType(node, 'ELEMENT_NODE') && isElementOfType(node, 'table')) {
        wrap(node.ownerDocument, node, 'div');
    }
    if (isNodeOfType(node, 'ELEMENT_NODE') && !node.isContentEditable) {
        node.removeAttribute('contenteditable');
    }
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
 * Create a new instance of ContentModelCopyPastePlugin
 * @param option The editor option
 */
export function createContentModelCopyPastePlugin(
    option: StandaloneEditorOptions
): PluginWithState<CopyPastePluginState> {
    return new ContentModelCopyPastePlugin(option);
}
