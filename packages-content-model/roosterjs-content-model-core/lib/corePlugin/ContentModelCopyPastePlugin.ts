import { addRangeToSelection } from './utils/addRangeToSelection';
import { ChangeSource } from '../constants/ChangeSource';
import { cloneModel } from '../publicApi/model/cloneModel';
import { ColorTransformDirection, PluginEventType } from 'roosterjs-editor-types';
import { deleteEmptyList } from './utils/deleteEmptyList';
import { deleteSelection } from '../publicApi/selection/deleteSelection';
import { extractClipboardItems } from 'roosterjs-editor-dom';
import { getSelectedCells } from '../publicApi/table/getSelectedCells';
import { iterateSelections } from '../publicApi/selection/iterateSelections';
import { paste } from '../publicApi/model/paste';
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
    ContentModelTable,
    DOMSelection,
    IStandaloneEditor,
    OnNodeCreated,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';
import type {
    CopyPastePluginState,
    IEditor,
    PluginWithState,
    ClipboardData,
} from 'roosterjs-editor-types';

/**
 * Copy and paste plugin for handling onCopy and onPaste event
 */
class ContentModelCopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: (IStandaloneEditor & IEditor) | null = null;
    private disposer: (() => void) | null = null;
    private state: CopyPastePluginState;

    /**
     * Construct a new instance of CopyPastePlugin
     * @param option The editor option
     */
    constructor(option: StandaloneEditorOptions) {
        this.state = {
            allowedCustomPasteType: option.allowedCustomPasteType || [],
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
    initialize(editor: IEditor) {
        this.editor = editor as IStandaloneEditor & IEditor;
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
            const model = this.editor.createContentModel();

            const pasteModel = cloneModel(model, {
                includeCachedElement: this.editor.isDarkMode()
                    ? (node, type) => {
                          if (type == 'cache') {
                              return undefined;
                          } else {
                              const result = node.cloneNode(true /*deep*/) as HTMLElement;

                              this.editor?.transformToDarkColor(
                                  result,
                                  ColorTransformDirection.DarkToLight
                              );

                              result.style.color = result.style.color || 'inherit';
                              result.style.backgroundColor =
                                  result.style.backgroundColor || 'inherit';

                              return result;
                          }
                      }
                    : false,
            });
            if (selection.type === 'table') {
                iterateSelections(pasteModel, (_, tableContext) => {
                    if (tableContext?.table) {
                        preprocessTable(tableContext.table);

                        return true;
                    }
                    return false;
                });
            }
            const tempDiv = this.getTempDiv(this.editor);
            const selectionForCopy = contentModelToDom(
                tempDiv.ownerDocument,
                tempDiv,
                pasteModel,
                createModelToDomContext(),
                onNodeCreated
            );

            let newRange: Range | null = selectionForCopy
                ? domSelectionToRange(doc, selectionForCopy, tempDiv)
                : null;
            if (newRange) {
                newRange = this.editor.triggerPluginEvent(PluginEventType.BeforeCutCopy, {
                    clonedRoot: tempDiv,
                    range: newRange,
                    rawEvent: event as ClipboardEvent,
                    isCut,
                }).range;

                if (newRange) {
                    addRangeToSelection(doc, newRange);
                }

                this.editor.runAsync(e => {
                    const editor = e as IStandaloneEditor & IEditor;

                    cleanUpAndRestoreSelection(tempDiv);
                    editor.focus();
                    editor.setDOMSelection(selection);

                    if (isCut) {
                        editor.formatContentModel(
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
                    {
                        allowedCustomPasteType: this.state.allowedCustomPasteType,
                    },
                    true /*pasteNativeEvent*/
                ).then((clipboardData: ClipboardData) => {
                    if (!editor.isDisposed()) {
                        paste(editor, clipboardData);
                    }
                });
            }
        }
    };

    private getTempDiv(editor: IEditor) {
        const div = editor.getCustomData(
            'CopyPasteTempDiv',
            () => {
                const tempDiv = editor.getDocument().createElement('div');

                tempDiv.style.width = '600px';
                tempDiv.style.height = '1px';
                tempDiv.style.overflow = 'hidden';
                tempDiv.style.position = 'fixed';
                tempDiv.style.top = '0';
                tempDiv.style.left = '0';
                tempDiv.style.userSelect = 'text';
                tempDiv.contentEditable = 'true';

                editor.getDocument().body.appendChild(tempDiv);

                return tempDiv;
            },
            tempDiv => tempDiv.parentNode?.removeChild(tempDiv)
        );

        div.style.backgroundColor = 'white';
        div.style.color = 'black';
        div.childNodes.forEach(node => div.removeChild(node));

        div.style.display = '';
        div.focus();

        return div;
    }
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

function domSelectionToRange(
    doc: Document,
    selection: DOMSelection,
    tempDiv: HTMLDivElement
): Range | null {
    let newRange: Range | null = null;

    if (selection.type === 'table') {
        const table = tempDiv.querySelector(`#${selection.table.id}`) as HTMLTableElement;
        const elementToSelect =
            table.parentElement?.childElementCount == 1 ? table.parentElement : table;

        newRange = doc.createRange();
        newRange.selectNode(elementToSelect);
    } else if (selection.type === 'image') {
        const image = tempDiv.querySelector('#' + selection.image.id);

        if (image) {
            newRange = doc.createRange();
            newRange.selectNode(image);
        }
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
