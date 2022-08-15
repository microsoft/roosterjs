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
            if (
                table.cells.every(
                    (row, rowIndex) =>
                        rowIndex < sel.firstRow ||
                        rowIndex > sel.lastRow ||
                        row[colIndex + 1]?.spanLeft
                )
            ) {
                table.cells.forEach((row, rowIndex) => {
                    if (rowIndex >= sel.firstRow && rowIndex <= sel.lastRow) {
                        const cell = row[colIndex];
                        const rightCell = row[colIndex + 1];

                        rightCell.spanLeft = false;

                        if (cell.format.width) {
                            rightCell.format.width = cell.format.width / 2;
                            cell.format.width = cell.format.width / 2;
                        }
                    }
                });
            } else {
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

                            if (newCell.format.width) {
                                newCell.format.width = 0;
                            }
                        } else {
                            cell.format.width! /= 2;
                            newCell.format.width! /= 2;
                            newCell.isSelected = cell.isSelected;
                        }
                        row.splice(colIndex + 1, 0, newCell);
                    }
                });
            }
        }
    }
}
