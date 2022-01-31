import { VCell } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Execute an action on all the cells
 * @param callback action to apply on all the cells.
 */
export function forEachCell(
    vTable: VTable,
    callback: (cell: VCell, x?: number, y?: number) => void
): void {
    for (let indexY = 0; indexY < vTable.cells.length; indexY++) {
        for (let indexX = 0; indexX < vTable.cells[indexY].length; indexX++) {
            callback(vTable.cells[indexY][indexX], indexX, indexY);
        }
    }
}
