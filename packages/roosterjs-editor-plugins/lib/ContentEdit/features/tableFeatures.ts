import shouldInsertLineBefore from './shouldInsertLineBefore';
import { cacheGetEventData, ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { NodeType, PluginEvent, PluginKeyboardEvent, PositionType } from 'roosterjs-editor-types';
import {
    contains,
    createNewLineNode,
    getTagOfNode,
    isVoidHtmlElement,
    Position,
    VTable,
} from 'roosterjs-editor-dom';

export const TabInTable: ContentEditFeature = {
    keys: [Keys.TAB],
    shouldHandleEvent: cacheGetTableCell,
    handleEvent: (event, editor) => {
        let shift = event.rawEvent.shiftKey;
        let td = cacheGetTableCell(event, editor);
        for (
            let vtable = new VTable(td),
                step = shift ? -1 : 1,
                row = vtable.row,
                col = vtable.col + step;
            ;
            col += step
        ) {
            if (col < 0 || col >= vtable.cells[row].length) {
                row += step;
                if (row < 0 || row >= vtable.cells.length) {
                    editor.select(vtable.table, shift ? PositionType.Before : PositionType.After);
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

export const UpDownInTable: ContentEditFeature = {
    keys: [Keys.UP, Keys.DOWN],
    shouldHandleEvent: cacheGetTableCell,
    handleEvent: (event, editor) => {
        let td = cacheGetTableCell(event, editor);
        let vtable = new VTable(td);
        let isUp = event.rawEvent.which == Keys.UP;
        let step = isUp ? -1 : 1;
        let targetTd: HTMLTableCellElement = null;
        let hasShiftKey = event.rawEvent.shiftKey;
        let { anchorNode, anchorOffset } = editor.getSelection();

        for (let row = vtable.row; row >= 0 && row < vtable.cells.length; row += step) {
            let cell = vtable.getCell(row, vtable.col);
            if (cell.td && cell.td != td) {
                targetTd = cell.td;
                break;
            }
        }

        editor.runAsync(() => {
            let newContainer = editor.getElementAtCursor();
            if (
                contains(vtable.table, newContainer) &&
                !contains(td, newContainer, true /*treatSameNodeAsContain*/)
            ) {
                let newPos = targetTd
                    ? new Position(targetTd, PositionType.Begin)
                    : new Position(vtable.table, isUp ? PositionType.Before : PositionType.After);
                if (hasShiftKey) {
                    newPos =
                        newPos.node.nodeType == NodeType.Element && isVoidHtmlElement(newPos.node)
                            ? new Position(
                                  newPos.node,
                                  newPos.isAtEnd ? PositionType.After : PositionType.Before
                              )
                            : newPos;
                    editor
                        .getSelection()
                        .setBaseAndExtent(anchorNode, anchorOffset, newPos.node, newPos.offset);
                } else {
                    editor.select(newPos);
                }
            }
        });
    },
};

export const EnterInFirstTableCell: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: getVTableForFirstCellOfStartingTable,
    handleEvent: (event, editor) => {
        let table = getVTableForFirstCellOfStartingTable(event, editor);
        let div = createNewLineNode(editor.getDocument());
        editor.addUndoSnapshot(() => {
            table.parentNode.insertBefore(div, table);
            editor.select(new Position(div, PositionType.Begin).normalize());
        });
        event.rawEvent.preventDefault();
    },
};

function cacheGetTableCell(event: PluginEvent, editor: Editor): HTMLTableCellElement {
    return cacheGetEventData(event, 'TABLECELL_FOR_TABLE_FEATURES', () => {
        let pos = editor.getFocusedPosition();
        let firstTd = editor.getElementAtCursor('TD,TH,LI', pos.node);
        return getTagOfNode(firstTd) == 'LI' ? null : (firstTd as HTMLTableCellElement);
    });
}

function getVTableForFirstCellOfStartingTable(event: PluginKeyboardEvent, editor: Editor) {
    return cacheGetEventData(event, 'VTABLE_FOR_FIRST_CELL', () => {
        // Provide a chance to keep browser default behavior by pressing SHIFT
        let td = event.rawEvent.shiftKey ? null : cacheGetTableCell(event, editor);
        return td && shouldInsertLineBefore(editor, td)
            ? editor.getElementAtCursor('TABLE', td)
            : null;
    });
}
