import { cloneCell } from './cloneCell';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';

/**
 * @internal
 */
export function splitTableCellVertically(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let rowIndex = sel.lastRow; rowIndex >= sel.firstRow; rowIndex--) {
            const row = table.cells[rowIndex];
            const newRow = row.map((cell, colIndex) => {
                const newCell = cloneCell(cell);

                if (colIndex < sel.firstCol || colIndex > sel.lastCol) {
                    newCell.spanAbove = true;
                    newCell.format.height = 0;
                } else {
                    cell.format.height! /= 2;
                    newCell.format.height! /= 2;
                }

                return newCell;
            });

            table.cells.splice(rowIndex + 1, 0, newRow);
        }
    }
}
