import { hasSelectionInBlockGroup } from '../selection/hasSelectionInBlockGroup';
import type {
    ReadonlyContentModelTable,
    TableSelectionCoordinates,
} from 'roosterjs-content-model-types';

/**
 * Get selection coordinates of a table. If there is no selection, return null
 * @param table The table model to get selection from
 */
export function getSelectedCells(
    table: ReadonlyContentModelTable
): TableSelectionCoordinates | null {
    let firstRow = -1;
    let firstColumn = -1;
    let lastRow = -1;
    let lastColumn = -1;
    let hasSelection = false;

    table.rows.forEach((row, rowIndex) =>
        row.cells.forEach((cell, colIndex) => {
            if (hasSelectionInBlockGroup(cell)) {
                hasSelection = true;

                if (firstRow < 0) {
                    firstRow = rowIndex;
                }

                if (firstColumn < 0) {
                    firstColumn = colIndex;
                }

                lastRow = Math.max(lastRow, rowIndex);
                lastColumn = Math.max(lastColumn, colIndex);
            }
        })
    );

    return hasSelection ? { firstRow, firstColumn, lastRow, lastColumn } : null;
}
