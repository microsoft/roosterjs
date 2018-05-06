import { ContentEditFeature } from '../ContentEditFeatures';
import { PositionType } from 'roosterjs-editor-types';
import { VTable, cacheGetNodeAtCursor } from 'roosterjs-editor-api';

const KEY_TAB = 9;

export const TabInTable: ContentEditFeature = {
    key: KEY_TAB,
    shouldHandleEvent: (event, editor) => {
        return cacheGetNodeAtCursor(editor, event, ['TD', 'TH']);
    },
    handleEvent: (event, editor) => {
        let shift = (event.rawEvent as KeyboardEvent).shiftKey;
        let td = cacheGetNodeAtCursor(editor, event, ['TD', 'TH']) as HTMLTableCellElement;
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
