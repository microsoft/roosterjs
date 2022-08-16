import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { hasSelectionInBlock } from '../selection/hasSelectionInBlock';

/**
 * @internal
 */
export function getSelectedCells(
    table: ContentModelTable
): {
    firstRow: number;
    firstCol: number;
    lastRow: number;
    lastCol: number;
} | null {
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
