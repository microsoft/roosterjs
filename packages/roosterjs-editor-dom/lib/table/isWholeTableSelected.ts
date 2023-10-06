import type VTable from './VTable';
import type { TableSelection } from 'roosterjs-editor-types';

/**
 * Check if the whole table is selected
 * @param vTable VTable to check whether all cells are selected
 * @param selection Table selection with first cell selected and last cell selected coordinates.
 * @returns
 */
export default function isWholeTableSelected(vTable: VTable, selection: TableSelection) {
    if (!selection || !vTable.cells) {
        return false;
    }
    const { firstCell, lastCell } = selection;
    const rowsLength = vTable.cells.length - 1;
    const rowCells = vTable.cells[rowsLength];
    if (!rowCells) {
        return false;
    }
    const colIndex = rowCells.length - 1;
    const firstX = firstCell.x;
    const firstY = firstCell.y;
    const lastX = lastCell.x;
    const lastY = lastCell.y;
    return firstX == 0 && firstY == 0 && lastX == colIndex && lastY == rowsLength;
}
