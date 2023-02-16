import { editTable, setIndentation } from 'roosterjs-editor-api';
import {
    BuildInEditFeature,
    IEditor,
    Keys,
    NodeType,
    PluginEvent,
    PositionType,
    TableFeatureSettings,
    TableOperation,
    PluginKeyboardEvent,
    SelectionRangeTypes,
    TableSelectionRange,
    Indentation,
    ExperimentalFeatures,
} from 'roosterjs-editor-types';
import {
    Browser,
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
        let shift = event.rawEvent.shiftKey;
        let td = cacheGetTableCell(event, editor);
        let vtable = cacheVTable(event, td);

        for (let step = shift ? -1 : 1, row = vtable.row, col = vtable.col + step; ; col += step) {
            if (col < 0 || col >= vtable.cells[row].length) {
                row += step;
                if (row < 0) {
                    editor.select(vtable.table, PositionType.Before);
                    break;
                } else if (row >= vtable.cells.length) {
                    editTable(editor, TableOperation.InsertBelow);
                    break;
                }
                col = shift ? vtable.cells[row].length - 1 : 0;
            }
            let cell = vtable.getCell(row, col);
            if (cell.td) {
                editor.select(cell.td, PositionType.Begin);
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
            let shift = event.rawEvent.shiftKey;
            let selection = editor.getSelectionRangeEx() as TableSelectionRange;
            let td = cacheGetTableCell(event, editor);
            let vtable = cacheVTable(event, td);

            if (shift && editor.getElementAtCursor('blockquote', vtable.table, event)) {
                setIndentation(editor, Indentation.Decrease);
            } else if (!shift) {
                setIndentation(editor, Indentation.Increase);
            }

            editor.select(selection.table, selection.coordinates);
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
        const vtable = new VTable(td);
        const isUp = event.rawEvent.which == Keys.UP;
        const step = isUp ? -1 : 1;
        const hasShiftKey = event.rawEvent.shiftKey;
        const selection = editor.getDocument().defaultView?.getSelection();
        let targetTd: HTMLTableCellElement = null;

        if (selection) {
            let { anchorNode, anchorOffset } = selection;

            for (let row = vtable.row; row >= 0 && row < vtable.cells.length; row += step) {
                let cell = vtable.getCell(row, vtable.col);
                if (cell.td && cell.td != td) {
                    targetTd = cell.td;
                    break;
                }
            }

            editor.runAsync(editor => {
                let newContainer = editor.getElementAtCursor();
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
                        selection?.setBaseAndExtent(
                            anchorNode,
                            anchorOffset,
                            newPos.node,
                            newPos.offset
                        );
                    } else {
                        editor.select(newPos);
                    }
                }
            });
        }
    },
    defaultDisabled: !Browser.isChrome && !Browser.isSafari,
};

/**
 * Requires @see ExperimentalFeatures.DeleteTableWithBackspace
 * Delete a table selected with the table selector pressing Backspace key
 */
const DeleteTableWithBackspace: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event: PluginKeyboardEvent, editor: IEditor) =>
        cacheIsWholeTableSelected(event, editor) &&
        editor.isFeatureEnabled(ExperimentalFeatures.DeleteTableWithBackspace),
    handleEvent: (event, editor) => {
        const td = cacheGetTableCell(event, editor);
        const vtable = new VTable(td);
        vtable.edit(TableOperation.DeleteTable);
        vtable.writeBack();
    },
};

function cacheGetTableCell(event: PluginEvent, editor: IEditor): HTMLTableCellElement {
    return cacheGetEventData(event, 'TABLE_CELL_FOR_TABLE_FEATURES', () => {
        let pos = editor.getFocusedPosition();
        let firstTd = pos && editor.getElementAtCursor('TD,TH,LI', pos.node);
        return (
            firstTd && (getTagOfNode(firstTd) == 'LI' ? null : (firstTd as HTMLTableCellElement))
        );
    });
}

function cacheIsWholeTableSelected(event: PluginEvent, editor: IEditor) {
    return cacheGetEventData(event, 'WHOLE_TABLE_SELECTED_FOR_FEATURES', () => {
        const td = cacheGetTableCell(event, editor);
        let vtable = cacheVTable(event, td);
        let selection = editor.getSelectionRangeEx();
        return (
            selection.type == SelectionRangeTypes.TableSelection &&
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
