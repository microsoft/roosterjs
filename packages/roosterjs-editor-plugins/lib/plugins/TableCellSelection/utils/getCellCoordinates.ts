import { Coordinates } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Gets the coordinates of a cell
 * @param cellInput The cell the to find the coordinates
 * @returns Coordinates of the cell, null if not found
 */
export function getCellCoordinates(vTable: VTable, cellInput: Node): Coordinates | undefined {
    let result: Coordinates | undefined;
    if (vTable?.cells) {
        for (let indexY = 0; indexY < vTable.cells.length; indexY++) {
            for (let indexX = 0; indexX < vTable.cells[indexY].length; indexX++) {
                if (cellInput == vTable.cells[indexY][indexX].td) {
                    result = {
                        x: indexX,
                        y: indexY,
                    };
                }
            }
        }
    }

    return result;
}
