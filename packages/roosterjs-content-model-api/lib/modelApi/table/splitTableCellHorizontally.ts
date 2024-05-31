import { createTableCell, getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type { ShallowMutableContentModelTable } from 'roosterjs-content-model-types';

const MIN_WIDTH = 30;

/**
 * @internal
 */
export function splitTableCellHorizontally(table: ShallowMutableContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let colIndex = sel.lastColumn; colIndex >= sel.firstColumn; colIndex--) {
            if (
                table.rows.every(
                    (row, rowIndex) =>
                        rowIndex < sel.firstRow ||
                        rowIndex > sel.lastRow ||
                        row.cells[colIndex + 1]?.spanLeft
                )
            ) {
                table.rows.forEach((row, rowIndex) => {
                    mutateBlock(row.cells[colIndex]);

                    if (rowIndex >= sel.firstRow && rowIndex <= sel.lastRow) {
                        mutateBlock(row.cells[colIndex + 1]).spanLeft = false;
                    }
                });
            } else {
                table.rows.forEach((row, rowIndex) => {
                    const cell = row.cells[colIndex];
                    if (cell) {
                        const newCell = createTableCell(
                            cell.spanLeft,
                            cell.spanAbove,
                            cell.isHeader,
                            cell.format
                        );

                        newCell.dataset = { ...cell.dataset };

                        if (rowIndex < sel.firstRow || rowIndex > sel.lastRow) {
                            newCell.spanLeft = true;
                        } else {
                            newCell.isSelected = cell.isSelected;
                        }
                        row.cells.splice(colIndex + 1, 0, newCell);

                        mutateBlock(row.cells[colIndex]);
                    }
                });

                const newWidth = Math.max(table.widths[colIndex] / 2, MIN_WIDTH);

                table.widths.splice(colIndex, 1, newWidth, newWidth);
            }
        }
    }
}
