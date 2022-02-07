import { normalizeTableSelection } from 'roosterjs-editor-dom';
import { VCell } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Executes an action to all the cells within the selection range.
 * @param callback action to apply on each selected cell
 * @returns the amount of cells modified
 */
export function forEachSelectedCell(vTable: VTable, callback: (cell: VCell) => void): number {
    let selectedCells = 0;
    vTable.selection = normalizeTableSelection(vTable.selection);

    const { lastCell, firstCell } = vTable.selection;

    for (let y = 0; y < vTable.cells.length; y++) {
        for (let x = 0; x < vTable.cells[y].length; x++) {
            if (y >= firstCell.y && y <= lastCell.y && x >= firstCell.x && x <= lastCell.x) {
                selectedCells += 1;
                callback(vTable.cells[y][x]);
            }
        }
    }

    return selectedCells;
}
