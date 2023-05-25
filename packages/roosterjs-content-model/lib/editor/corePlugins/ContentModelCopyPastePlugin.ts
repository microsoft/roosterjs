import contentModelToDom from '../../modelToDom/contentModelToDom';
import { cloneModel } from '../../modelApi/common/cloneModel';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import {
    addRangeToSelection,
    createElement,
    moveChildNodes,
    createRange,
    extractClipboardItems,
    toArray,
    Browser,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    CopyPastePluginState,
    EditorOptions,
    IEditor,
    PluginEventType,
    PluginWithState,
    KnownCreateElementDataIndex,
    ClipboardData,
    SelectionRangeTypes,
    SelectionRangeEx,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Copy and paste plugin for handling onCopy and onPaste event
 */
export default class ContentModelCopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: IContentModelEditor | null = null;
    private disposer: (() => void) | null = null;
    private state: CopyPastePluginState;

    /**
     * Construct a new instance of CopyPastePlugin
     * @param options The editor options
     */
    constructor(options: EditorOptions) {
        this.state = {
            allowedCustomPasteType: options.allowedCustomPasteType || [],
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
        const selection = this.editor.getSelectionRangeEx();
        if (selection && !selection.areAllCollapsed) {
            const model = this.editor.createContentModel({
                disableCacheElement: true,
            });

            const pasteModel = cloneModel(model);
            if (selection.type === SelectionRangeTypes.TableSelection) {
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
            const selectionAfterPaste = contentModelToDom(
                tempDiv.ownerDocument,
                tempDiv,
                pasteModel,
                {
                    isDarkMode: false /* To force light mode on paste */,
                    darkColorHandler: this.editor.getDarkColorHandler(),
                }
            );

            let newRange: Range | null = selectionExToRange(selectionAfterPaste, tempDiv);
            if (newRange) {
                const cutCopyEvent = this.editor.triggerPluginEvent(PluginEventType.BeforeCutCopy, {
                    clonedRoot: tempDiv,
                    range: newRange,
                    rawEvent: event as ClipboardEvent,
                    isCut,
                });

                if (cutCopyEvent.range) {
                    addRangeToSelection(newRange);
                }

                this.editor.runAsync(editor => {
                    cleanUpAndRestoreSelection(tempDiv);
                    editor.focus();
                    if (selectionAfterPaste) {
                        this.editor?.select(selectionAfterPaste);
                    }
                    if (isCut) {
                        editor.addUndoSnapshot(() => {
                            deleteSelection(model);
                            this.editor?.setContentModel(model);
                        }, ChangeSource.Cut);
                    }
                });
            }
        }
    }

    private onPaste = (event: Event) => {
        if (this.editor && isClipboardEvent(event)) {
            const editor = this.editor;

            const dataTransfer = event.clipboardData;

            if (dataTransfer?.items) {
                event.preventDefault();
                extractClipboardItems(toArray(dataTransfer.items), {
                    allowedCustomPasteType: this.state.allowedCustomPasteType,
                }).then((clipboardData: ClipboardData) => {
                    if (!editor.isDisposed()) {
                        removeContentForAndroid(editor);
                        editor.paste(clipboardData);
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
function removeContentForAndroid(editor: IContentModelEditor) {
    if (Browser.isAndroid) {
        const model = editor.createContentModel();
        deleteSelection(model);
        editor.setContentModel(model);
    }
}
function selectionExToRange(
    selection: SelectionRangeEx | null,
    tempDiv: HTMLDivElement
): Range | null {
    if (!selection) {
        return null;
    }
    let newRange: Range | null = null;
    if (selection.type === SelectionRangeTypes.TableSelection && selection.coordinates) {
        const table = tempDiv.querySelector(`#${selection.table.id}`) as HTMLTableElement;
        newRange = createRange(table);
    } else if (selection.type === SelectionRangeTypes.ImageSelection) {
        const image = tempDiv.querySelector('#' + selection.image.id);

        if (image) {
            newRange = createRange(image);
        }
    } else {
        newRange = selection.ranges[0];
    }

    return newRange;
}
