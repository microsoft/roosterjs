import { normalizeTableSelection } from './normalizeTableSelection';
import { Table, VCell } from 'roosterjs-editor-types';

/**
 * @internal
 * Remove the cells outside of the selection.
 * @param outsideOfSelection whether to remove the cells outside or inside of the selection
 */
export function removeCellsBySelection(vTable: Table, outsideOfSelection: boolean = true) {
    const { firstCell, lastCell } = normalizeTableSelection(vTable.selection);
    const rowsLength = vTable.cells.length - 1;
    const colIndex = vTable.cells[rowsLength].length - 1;
    const resultCells: VCell[][] = [];

    const firstX = firstCell.x;
    const firstY = firstCell.y;
    const lastX = lastCell.x;
    const lastY = lastCell.y;

    const selectedAllTable = firstX == 0 && firstY == 0 && lastX == colIndex && lastY == rowsLength;

    if (selectedAllTable) {
        if (!outsideOfSelection) {
            vTable.cells = [];
        }
        return;
    }

    const isInsideOfSelection = (x: number, y: number) =>
        ((y >= firstY && y <= lastY) || (y <= firstY && y >= lastY)) &&
        ((x >= firstX && x <= lastX) || (x <= firstX && x >= lastX));

    const validation = (x: number, y: number) =>
        outsideOfSelection ? isInsideOfSelection(x, y) : !isInsideOfSelection(x, y);

    vTable.cells.forEach((row, y) => {
        row = row.filter((_, x) => validation(x, y));
        if (row.length > 0) {
            resultCells.push(row);
        }
    });
    vTable.cells = resultCells;
}
