import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createTableCell } from '../creators/createTableCell';
import { getSelectedCells } from './getSelectedCells';

/**
 * @internal
 */
export function splitTableCellHorizontally(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let colIndex = sel.lastCol; colIndex >= sel.firstCol; colIndex--) {
            table.cells.forEach((row, rowIndex) => {
                const cell = row[colIndex];
                if (cell) {
                    const newCell = createTableCell(
                        cell.spanLeft,
                        cell.spanAbove,
                        cell.isHeader,
                        cell.format
                    );

                    if (rowIndex < sel.firstRow || rowIndex > sel.lastRow) {
                        newCell.spanLeft = true;
                        newCell.format.width = 0;
                    } else {
                        cell.format.width! /= 2;
                        newCell.format.width! /= 2;
                    }
                    row.splice(colIndex + 1, 0, newCell);
                }
            });
        }
    }
}
