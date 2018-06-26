import { ContentEditFeature } from '../ContentEditFeatures';
import { Editor } from 'roosterjs-editor-core';
import { PluginEvent, PositionType } from 'roosterjs-editor-types';
import { VTable, contains, getTagOfNode } from 'roosterjs-editor-dom';
import { cacheGetNodeAtCursor, getNodeAtCursor } from 'roosterjs-editor-api';

const KEY_TAB = 9;
const KEY_UP = 38;
const KEY_DOWN = 40;

export const TabInTable: ContentEditFeature = {
    keys: [KEY_TAB],
    shouldHandleEvent: cacheGetTableCell,
    handleEvent: (event, editor) => {
        let shift = (event.rawEvent as KeyboardEvent).shiftKey;
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
    keys: [KEY_UP, KEY_DOWN],
    shouldHandleEvent: cacheGetTableCell,
    handleEvent: (event, editor) => {
        let td = cacheGetTableCell(event, editor);
        let vtable = new VTable(td);
        let isUp = (event.rawEvent as KeyboardEvent).which == KEY_UP;
        let step = isUp ? -1 : 1;
        let targetTd: HTMLTableCellElement = null;

        for (let row = vtable.row; row >= 0 && row < vtable.cells.length; row += step) {
            let cell = vtable.getCell(row, vtable.col);
            if (cell.td && cell.td != td) {
                targetTd = cell.td;
                break;
            }
        }

        editor.runAsync(() => {
            let newContainer = getNodeAtCursor(editor);
            if (!contains(td, newContainer, true /*treatSameNodeAsContain*/)) {
                if (targetTd) {
                    editor.select(targetTd, PositionType.Begin);
                } else {
                    editor.select(vtable.table, isUp ? PositionType.Before : PositionType.After);
                }
            }
        });
    },
};

function cacheGetTableCell(event: PluginEvent, editor: Editor): HTMLTableCellElement {
    let firstTd = cacheGetNodeAtCursor(editor, event, ['TD', 'TH', 'LI']);
    return getTagOfNode(firstTd) == 'LI' ? null : (firstTd as HTMLTableCellElement);
}
