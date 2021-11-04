import safeInstanceOf from './safeInstanceOf';
import { IEditor } from 'roosterjs-editor-types';

const TABLE_CELL_SELECTED_CLASS = 'TableCellSelected';
const TEMP_BACKGROUND_COLOR = 'tempBackgroundColor';

/**
 * Remove the selected style of the cells
 * @param editor Editor Instance
 */
export default function clearSelectedTableCells(editor: IEditor) {
    getSelectedTableCells(editor).forEach((cell: Element) => {
        if (safeInstanceOf(cell, 'HTMLTableCellElement')) {
            cell.classList.remove(TABLE_CELL_SELECTED_CLASS);
            cell.style.backgroundColor = cell.dataset[TEMP_BACKGROUND_COLOR];
            delete cell.dataset[TEMP_BACKGROUND_COLOR];
        }
    });
}

/**
 * Get the cells with the selected cells class
 * @param editor Editor Instance
 * @returns Array of Nodes
 */
export function getSelectedTableCells(editor: IEditor) {
    return editor?.getDocument().querySelectorAll('.' + TABLE_CELL_SELECTED_CLASS);
}
