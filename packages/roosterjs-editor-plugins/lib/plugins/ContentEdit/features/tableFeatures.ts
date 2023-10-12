import { editTable, setIndentation } from 'roosterjs-editor-api';
import type {
    BuildInEditFeature,
    IEditor,
    PluginEvent,
    TableFeatureSettings,
    PluginKeyboardEvent,
    TableSelectionRange,
} from 'roosterjs-editor-types';
import {
    Keys,
    NodeType,
    PositionType,
    TableOperation,
    SelectionRangeTypes,
    Indentation,
    ExperimentalFeatures,
} from 'roosterjs-editor-types';
import {
    cacheGetEventData,
    contains,
    getTagOfNode,
    isVoidHtmlElement,
    isWholeTableSelected,
    Position,
    VTable,
} from 'roosterjs-editor-dom';

/**
 * TabInTable edit feature, provides the ability to jump between cells when user press TAB in table
 */
const TabInTable: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event: PluginKeyboardEvent, editor: IEditor) =>
        cacheGetTableCell(event, editor) && !cacheIsWholeTableSelected(event, editor),
    handleEvent: (event, editor) => {
        const shift = event.rawEvent.shiftKey;
        const td = cacheGetTableCell(event, editor);
        if (!td) {
            return;
        }
        const vtable = cacheVTable(event, td);

        for (
            let step = shift ? -1 : 1, row = vtable.row ?? 0, col = (vtable.col ?? 0) + step;
            ;
            col += step
        ) {
            const tableCells = vtable.cells ?? [];
            if (col < 0 || col >= tableCells[row].length) {
                row += step;
                if (row < 0) {
                    editor.select(vtable.table, PositionType.Before);
                    break;
                } else if (row >= tableCells.length) {
                    editTable(editor, TableOperation.InsertBelow);
                    break;
                }
                col = shift ? tableCells[row].length - 1 : 0;
            }
            const cell = vtable.getCell(row, col);
            if (cell.td) {
                const newPos = new Position(cell.td, PositionType.Begin).normalize();
                editor.select(newPos);
                break;
            }
        }
        event.rawEvent.preventDefault();
    },
};

/**
 * IndentTableOnTab edit feature, provides the ability to indent the table if it is all cells are selected.
 */
const IndentTableOnTab: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event: PluginKeyboardEvent, editor: IEditor) =>
        cacheGetTableCell(event, editor) && cacheIsWholeTableSelected(event, editor),
    handleEvent: (event, editor) => {
        event.rawEvent.preventDefault();

        editor.addUndoSnapshot(() => {
            const shift = event.rawEvent.shiftKey;
            const selection = editor.getSelectionRangeEx() as TableSelectionRange;
            const td = cacheGetTableCell(event, editor);
            if (!td) {
                return;
            }
            const vtable = cacheVTable(event, td);

            if (shift && editor.getElementAtCursor('blockquote', vtable.table, event)) {
                setIndentation(editor, Indentation.Decrease);
            } else if (!shift) {
                setIndentation(editor, Indentation.Increase);
            }

            if (selection.coordinates) {
                editor.select(selection.table, selection.coordinates);
            }
        });
    },
};

/**
 * UpDownInTable edit feature, provides the ability to jump to cell above/below when user press UP/DOWN
 * in table
 */
const UpDownInTable: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.UP, Keys.DOWN],
    shouldHandleEvent: (event: PluginKeyboardEvent, editor: IEditor) =>
        cacheGetTableCell(event, editor) && !cacheIsWholeTableSelected(event, editor),
    handleEvent: (event, editor) => {
        const td = cacheGetTableCell(event, editor);
        if (!td) {
            return;
        }
        const vtable = new VTable(td);
        const isUp = event.rawEvent.which == Keys.UP;
        const step = isUp ? -1 : 1;
        const hasShiftKey = event.rawEvent.shiftKey;
        const selection = editor.getDocument().defaultView?.getSelection();
        let targetTd: HTMLTableCellElement | null = null;

        if (selection) {
            const { anchorNode, anchorOffset } = selection;

            for (
                let row = vtable.row ?? 0;
                row >= 0 && vtable.cells && row < vtable.cells.length;
                row += step
            ) {
                const cell = vtable.getCell(row, vtable.col ?? 0);
                if (cell.td && cell.td != td) {
                    targetTd = cell.td;
                    break;
                }
            }

            editor.runAsync(editor => {
                const newContainer = editor.getElementAtCursor();
                if (
                    contains(vtable.table, newContainer) &&
                    !contains(td, newContainer, true /*treatSameNodeAsContain*/)
                ) {
                    let newPos = targetTd
                        ? new Position(targetTd, PositionType.Begin)
                        : new Position(
                              vtable.table,
                              isUp ? PositionType.Before : PositionType.After
                          );
                    if (hasShiftKey) {
                        newPos =
                            newPos.node.nodeType == NodeType.Element &&
                            isVoidHtmlElement(newPos.node)
                                ? new Position(
                                      newPos.node,
                                      newPos.isAtEnd ? PositionType.After : PositionType.Before
                                  )
                                : newPos;
                        const selection = editor.getDocument().defaultView?.getSelection();
                        if (anchorNode) {
                            selection?.setBaseAndExtent(
                                anchorNode,
                                anchorOffset,
                                newPos.node,
                                newPos.offset
                            );
                        }
                    } else {
                        editor.select(newPos.normalize());
                    }
                }
            });
        }
    },
};

/**
 * Requires @see ExperimentalFeatures.DeleteTableWithBackspace
 * Delete a table selected with the table selector pressing Backspace key
 */
const DeleteTableWithBackspace: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event: PluginKeyboardEvent, editor: IEditor) =>
        editor.isFeatureEnabled(ExperimentalFeatures.DeleteTableWithBackspace) &&
        cacheIsWholeTableSelected(event, editor),
    handleEvent: (event, editor) => {
        const td = cacheGetTableCell(event, editor);
        if (!td) {
            return;
        }
        const vtable = new VTable(td);
        vtable.edit(TableOperation.DeleteTable);
        vtable.writeBack();
    },
};

function cacheGetTableCell(event: PluginEvent, editor: IEditor): HTMLTableCellElement | null {
    return cacheGetEventData(event, 'TABLE_CELL_FOR_TABLE_FEATURES', () => {
        const pos = editor.getFocusedPosition();
        const firstTd = pos && editor.getElementAtCursor('TD,TH,LI', pos.node);
        return (
            firstTd && (getTagOfNode(firstTd) == 'LI' ? null : (firstTd as HTMLTableCellElement))
        );
    });
}

function cacheIsWholeTableSelected(event: PluginEvent, editor: IEditor) {
    return cacheGetEventData(event, 'WHOLE_TABLE_SELECTED_FOR_FEATURES', () => {
        const td = cacheGetTableCell(event, editor);
        if (!td) {
            return false;
        }
        const vtable = cacheVTable(event, td);
        const selection = editor.getSelectionRangeEx();
        return (
            selection.type == SelectionRangeTypes.TableSelection &&
            selection.coordinates &&
            isWholeTableSelected(vtable, selection.coordinates)
        );
    });
}

function cacheVTable(event: PluginEvent, td: HTMLTableCellElement) {
    return cacheGetEventData(event, 'VTABLE_FOR_TABLE_FEATURES', () => {
        return new VTable(td);
    });
}

/**
 * @internal
 */
export const TableFeatures: Record<
    keyof TableFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    tabInTable: TabInTable,
    upDownInTable: UpDownInTable,
    indentTableOnTab: IndentTableOnTab,
    deleteTableWithBackspace: DeleteTableWithBackspace,
};
