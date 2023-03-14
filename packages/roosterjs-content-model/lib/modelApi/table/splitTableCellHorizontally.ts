import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createTableCell } from '../creators/createTableCell';
import { getSelectedCells } from './getSelectedCells';

const MIN_WIDTH = 30;

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
                    delete row[colIndex].cachedElement;

                    if (rowIndex >= sel.firstRow && rowIndex <= sel.lastRow) {
                        row[colIndex + 1].spanLeft = false;
                        delete row[colIndex + 1].cachedElement;
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
                        } else {
                            newCell.isSelected = cell.isSelected;
                        }
                        row.splice(colIndex + 1, 0, newCell);

                        delete row[colIndex].cachedElement;
                    }
                });

                const newWidth = Math.max(table.widths[colIndex] / 2, MIN_WIDTH);

                table.widths.splice(colIndex, 1, newWidth, newWidth);
            }
        }
    }
}
