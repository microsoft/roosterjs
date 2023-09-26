import paste from '../../publicApi/utils/paste';
import { cloneModel } from '../../modelApi/common/cloneModel';
import { DeleteResult } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../../publicApi/utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import {
    contentModelToDom,
    createModelToDomContext,
    isNodeOfType,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';
import type { DOMSelection, OnNodeCreated } from 'roosterjs-content-model-types';
import {
    addRangeToSelection,
    createElement,
    moveChildNodes,
    createRange,
    extractClipboardItems,
    toArray,
    wrap,
    safeInstanceOf,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    CopyPastePluginState,
    IEditor,
    PluginEventType,
    PluginWithState,
    KnownCreateElementDataIndex,
    ClipboardData,
    ColorTransformDirection,
    NodeType,
} from 'roosterjs-editor-types';

/**
 * Copy and paste plugin for handling onCopy and onPaste event
 */
export default class ContentModelCopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: IContentModelEditor | null = null;
    private disposer: (() => void) | null = null;

    /**
     * Construct a new instance of CopyPastePlugin
     * @param options The editor options
     */
    constructor(private state: CopyPastePluginState) {}

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
        this.editor = editor as IContentModelEditor;
        this.disposer = this.editor.addDomEventHandler({
            paste: e => this.onPaste(e),
            copy: e => this.onCutCopy(e, false /*isCut*/),
            cut: e => this.onCutCopy(e, true /*isCut*/),
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

                              return result;
                          }
                      }
                    : false,
            });
            if (selection.type === 'table') {
                iterateSelections([pasteModel], (path, tableContext) => {
                    if (tableContext?.table) {
                        const table = tableContext?.table;
                        table.rows = table.rows
                            .map(row => {
                                return {
                                    ...row,
                                    cells: row.cells.filter(cell => cell.isSelected),
                                };
                            })
                            .filter(row => row.cells.length > 0);
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

            let newRange: Range | null = selectionExToRange(selectionForCopy, tempDiv);
            if (newRange) {
                newRange = this.editor.triggerPluginEvent(PluginEventType.BeforeCutCopy, {
                    clonedRoot: tempDiv,
                    range: newRange,
                    rawEvent: event as ClipboardEvent,
                    isCut,
                }).range;

                if (newRange) {
                    addRangeToSelection(newRange);
                }

                this.editor.runAsync(editor => {
                    cleanUpAndRestoreSelection(tempDiv);
                    editor.focus();
                    (editor as IContentModelEditor).setDOMSelection(selection);

                    if (isCut) {
                        formatWithContentModel(
                            editor as IContentModelEditor,
                            'cut',
                            (model, context) => {
                                if (
                                    deleteSelection(model, [], context).deleteResult ==
                                    DeleteResult.Range
                                ) {
                                    normalizeContentModel(model);
                                }

                                return true;
                            },
                            {
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
                const tempDiv = createElement(
                    KnownCreateElementDataIndex.CopyPasteTempDiv,
                    editor.getDocument()
                ) as HTMLDivElement;

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

function selectionExToRange(selection: DOMSelection | null, tempDiv: HTMLDivElement): Range | null {
    if (!selection) {
        return null;
    }
    let newRange: Range | null = null;
    if (selection.type === 'table') {
        const table = tempDiv.querySelector(`#${selection.table.id}`) as HTMLTableElement;
        const elementToSelect =
            table.parentElement?.childElementCount == 1 ? table.parentElement : table;
        newRange = createRange(elementToSelect);
    } else if (selection.type === 'image') {
        const image = tempDiv.querySelector('#' + selection.image.id);

        if (image) {
            newRange = createRange(image);
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
    if (safeInstanceOf(node, 'HTMLTableElement')) {
        wrap(node, 'div');
    }
    if (isNodeOfType(node, NodeType.Element) && !node.isContentEditable) {
        node.removeAttribute('contenteditable');
    }
};
