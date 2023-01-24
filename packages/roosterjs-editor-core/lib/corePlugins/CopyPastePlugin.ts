import { forEachSelectedCell } from './utils/forEachSelectedCell';
import { removeCellsOutsideSelection } from './utils/removeCellsOutsideSelection';
import {
    addRangeToSelection,
    createElement,
    extractClipboardEvent,
    moveChildNodes,
    Browser,
    setHtmlWithMetadata,
    createRange,
    VTable,
    isWholeTableSelected,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    CopyPastePluginState,
    EditorOptions,
    GetContentMode,
    IEditor,
    PluginEventType,
    PluginWithState,
    KnownCreateElementDataIndex,
    SelectionRangeEx,
    SelectionRangeTypes,
    TableSelection,
    TableOperation,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Copy and paste plugin for handling onCopy and onPaste event
 */
export default class CopyPastePlugin implements PluginWithState<CopyPastePluginState> {
    private editor: IEditor | null = null;
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
        return 'CopyPaste';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
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
        if (this.editor) {
            const selection = this.editor.getSelectionRangeEx();
            if (selection && !selection.areAllCollapsed) {
                const html = this.editor.getContent(GetContentMode.RawHTMLWithSelection);
                const tempDiv = this.getTempDiv(this.editor, true /*forceInLightMode*/);
                const metadata = setHtmlWithMetadata(
                    tempDiv,
                    html,
                    this.editor.getTrustedHTMLHandler()
                );
                let newRange: Range | null = null;

                if (
                    selection.type === SelectionRangeTypes.TableSelection &&
                    selection.coordinates
                ) {
                    const table = tempDiv.querySelector(
                        `#${selection.table.id}`
                    ) as HTMLTableElement;
                    newRange = this.createTableRange(table, selection.coordinates);
                    if (isCut) {
                        this.deleteTableContent(
                            this.editor,
                            selection.table,
                            selection.coordinates
                        );
                    }
                } else if (selection.type === SelectionRangeTypes.ImageSelection) {
                    const image = tempDiv.querySelector('#' + selection.image.id);

                    if (image) {
                        newRange = createRange(image);
                        if (isCut) {
                            this.deleteImage(this.editor, selection.image.id);
                        }
                    }
                } else {
                    newRange =
                        metadata?.type === SelectionRangeTypes.Normal
                            ? createRange(tempDiv, metadata.start, metadata.end)
                            : null;
                }
                if (newRange) {
                    const cutCopyEvent = this.editor.triggerPluginEvent(
                        PluginEventType.BeforeCutCopy,
                        {
                            clonedRoot: tempDiv,
                            range: newRange,
                            rawEvent: event as ClipboardEvent,
                            isCut,
                        }
                    );

                    if (cutCopyEvent.range) {
                        addRangeToSelection(newRange);
                    }

                    this.editor.runAsync(editor => {
                        this.cleanUpAndRestoreSelection(tempDiv, selection, !isCut /* isCopy */);

                        if (isCut) {
                            editor.addUndoSnapshot(() => {
                                const position = editor.deleteSelectedContent();
                                editor.focus();
                                editor.select(position);
                            }, ChangeSource.Cut);
                        }
                    });
                }
            }
        }
    }

    private onPaste = (event: Event) => {
        let range: Range | null = null;
        if (this.editor) {
            const editor = this.editor;
            extractClipboardEvent(
                event as ClipboardEvent,
                clipboardData => {
                    if (editor && !editor.isDisposed()) {
                        editor.paste(clipboardData);
                    }
                },
                {
                    allowedCustomPasteType: this.state.allowedCustomPasteType,
                    getTempDiv: () => {
                        range = editor.getSelectionRange() ?? null;
                        return this.getTempDiv(editor);
                    },
                    removeTempDiv: div => {
                        if (range) {
                            this.cleanUpAndRestoreSelection(div, range, false /* isCopy */);
                        }
                    },
                },
                this.editor.getSelectionRange() ?? undefined
            );
        }
    };

    private getTempDiv(editor: IEditor, forceInLightMode?: boolean) {
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

        if (forceInLightMode) {
            div.style.backgroundColor = 'white';
            div.style.color = 'black';
        }

        div.style.display = '';
        div.focus();

        return div;
    }

    private cleanUpAndRestoreSelection(
        tempDiv: HTMLDivElement,
        range: Range | SelectionRangeEx,
        isCopy: boolean
    ) {
        if (!!(<SelectionRangeEx>range)?.type || (<SelectionRangeEx>range).type == 0) {
            const selection = <SelectionRangeEx>range;
            switch (selection.type) {
                case SelectionRangeTypes.TableSelection:
                case SelectionRangeTypes.ImageSelection:
                    this.editor?.select(selection);
                    break;
                case SelectionRangeTypes.Normal:
                    const range = selection.ranges?.[0];
                    this.restoreRange(range, isCopy);
                    break;
            }
        } else {
            this.restoreRange(<Range>range, isCopy);
        }

        tempDiv.style.backgroundColor = '';
        tempDiv.style.color = '';
        tempDiv.style.display = 'none';
        moveChildNodes(tempDiv);
    }

    private restoreRange(range: Range, isCopy: boolean) {
        if (range && this.editor) {
            if (isCopy && Browser.isAndroid) {
                range.collapse();
            }
            this.editor.select(range);
        }
    }

    private createTableRange(table: HTMLTableElement, selection: TableSelection) {
        const clonedVTable = new VTable(table as HTMLTableElement);
        clonedVTable.selection = selection;
        removeCellsOutsideSelection(clonedVTable);
        clonedVTable.writeBack();
        return createRange(clonedVTable.table);
    }

    private deleteTableContent(
        editor: IEditor,
        table: HTMLTableElement,
        selection: TableSelection
    ) {
        const selectedVTable = new VTable(table);
        selectedVTable.selection = selection;

        forEachSelectedCell(selectedVTable, cell => {
            if (cell?.td) {
                cell.td.innerHTML = editor.getTrustedHTMLHandler()('<br>');
            }
        });

        const wholeTableSelected = isWholeTableSelected(selectedVTable, selection);
        const isWholeColumnSelected =
            table.rows.length - 1 === selection.lastCell.y && selection.firstCell.y === 0;
        if (wholeTableSelected) {
            selectedVTable.edit(TableOperation.DeleteTable);
            selectedVTable.writeBack();
        } else if (isWholeColumnSelected) {
            selectedVTable.edit(TableOperation.DeleteColumn);
            selectedVTable.writeBack();
        }
        if (wholeTableSelected || isWholeColumnSelected) {
            table.style.removeProperty('width');
            table.style.removeProperty('height');
        }
    }

    private deleteImage(editor: IEditor, imageId: string) {
        editor.queryElements('#' + imageId, node => {
            editor.deleteNode(node);
        });
    }
}
