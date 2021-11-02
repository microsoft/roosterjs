import { IEditor } from 'roosterjs-editor-types/lib';
import { safeInstanceOf } from '..';
import { TABLE_CELL_SELECTED_CLASS } from '../table/VTable';

export default function clearSelectedTableCells(editor: IEditor) {
    getSelectedTableCells(editor).forEach((cell: Element) => {
        if (safeInstanceOf(cell, 'HTMLTableCellElement')) {
            cell.classList.remove(TABLE_CELL_SELECTED_CLASS);
            cell.style.backgroundColor = '';
        }
    });
}

export function getSelectedTableCells(editor: IEditor) {
    return editor?.getDocument().querySelectorAll('.' + TABLE_CELL_SELECTED_CLASS);
}
