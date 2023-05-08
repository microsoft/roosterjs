import hasSelectionInBlockGroup from '../../publicApi/selection/hasSelectionInBlockGroup';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';

/**
 * @internal
 */
export interface TableSelectionCoordinates {
    firstRow: number;
    firstCol: number;
    lastRow: number;
    lastCol: number;
}

/**
 * @internal
 */
export function getSelectedCells(table: ContentModelTable): TableSelectionCoordinates | null {
    let firstRow = -1;
    let firstCol = -1;
    let lastRow = -1;
    let lastCol = -1;
    let hasSelection = false;

    table.rows.forEach((row, rowIndex) =>
        row.cells.forEach((cell, colIndex) => {
            if (hasSelectionInBlockGroup(cell)) {
                hasSelection = true;

                if (firstRow < 0) {
                    firstRow = rowIndex;
                }

                if (firstCol < 0) {
                    firstCol = colIndex;
                }

                lastRow = Math.max(lastRow, rowIndex);
                lastCol = Math.max(lastCol, colIndex);
            }
        })
    );

    return hasSelection ? { firstRow, firstCol, lastRow, lastCol } : null;
}
