import paste from '../../publicApi/utils/paste';
import { cloneModel } from '../../modelApi/common/cloneModel';
import { contentModelToDom, normalizeContentModel } from 'roosterjs-content-model-dom';
import { DeleteResult } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../../publicApi/utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDecorator,
    ContentModelSegment,
    ContentModelTableRow,
} from 'roosterjs-content-model-types';
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
    SelectionRangeTypes,
    SelectionRangeEx,
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
        const selection = this.editor.getSelectionRangeEx();
        if (selection && !selection.areAllCollapsed) {
            const model = this.editor.createContentModel();

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
            const selectionForCopy = contentModelToDom(
                tempDiv.ownerDocument,
                tempDiv,
                pasteModel,
                undefined /*editorContext, leave it undefined to use default context since we don't need editor-related dark mode info for pasted content*/,
                {
                    onNodeCreated,
                }
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
                    editor.select(selection);

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
        const elementToSelect =
            table.parentElement?.childElementCount == 1 ? table.parentElement : table;
        newRange = createRange(elementToSelect);
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

/**
 * @internal
 * Exported only for unit testing
 */
export const onNodeCreated = (
    _:
        | ContentModelBlock
        | ContentModelBlockGroup
        | ContentModelSegment
        | ContentModelDecorator
        | ContentModelTableRow,
    node: Node
): void => {
    if (safeInstanceOf(node, 'HTMLTableElement')) {
        wrap(node, 'div');
    }
};
