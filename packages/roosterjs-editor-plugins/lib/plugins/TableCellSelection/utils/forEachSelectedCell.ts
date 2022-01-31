import { tableCellSelectionCommon } from './tableCellSelectionCommon';
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

    const { lastCell, firstCell } = vTable.selection;

    for (let y = 0; y < vTable.cells.length; y++) {
        for (let x = 0; x < vTable.cells[y].length; x++) {
            let element = vTable.cells[y][x].td as HTMLElement;
            if (
                element?.classList.contains(tableCellSelectionCommon.TABLE_CELL_SELECTED) ||
                (((y >= firstCell.y && y <= lastCell.y) || (y <= firstCell.y && y >= lastCell.y)) &&
                    ((x >= firstCell.x && x <= lastCell.x) ||
                        (x <= firstCell.x && x >= lastCell.x)))
            ) {
                selectedCells += 1;
                callback(vTable.cells[y][x]);
            }
        }
    }

    return selectedCells;
}
