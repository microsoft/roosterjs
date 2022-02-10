import { VCell } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Remove the cells outside of the selection.
 */
export function removeCellsOutsideSelection(vTable: VTable) {
    const { firstCell, lastCell } = vTable.selection;
    const rowsLength = vTable.cells.length - 1;
    const colIndex = vTable.cells[rowsLength].length - 1;
    const resultCells: VCell[][] = [];

    const firstX = firstCell.x;
    const firstY = firstCell.y;
    const lastX = lastCell.x;
    const lastY = lastCell.y;

    const selectedAllTable = firstX == 0 && firstY == 0 && lastX == colIndex && lastY == rowsLength;

    if (selectedAllTable) {
        return;
    }

    vTable.cells.forEach((row, y) => {
        row = row.filter((_, x) => y >= firstY && y <= lastY && x >= firstX && x <= lastX);
        if (row.length > 0) {
            resultCells.push(row);
        }
    });
    vTable.cells = resultCells;
}
