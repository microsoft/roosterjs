import hasSelectionInBlock from '../../publicApi/selection/hasSelectionInBlock';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { TableSelectionCoordinates } from '../selection/setSelectionToTable';

/**
 * @internal
 */
export function getSelectedCells(table: ContentModelTable): TableSelectionCoordinates | null {
    let firstRow = -1;
    let firstCol = -1;
    let lastRow = -1;
    let lastCol = -1;
    let hasSelection = false;

    table.cells.forEach((row, rowIndex) =>
        row.forEach((cell, colIndex) => {
            if (hasSelectionInBlock(cell)) {
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
