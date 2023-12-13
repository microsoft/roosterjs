import { createTableCell } from 'roosterjs-content-model-dom';
import { getSelectedCells } from 'roosterjs-content-model-core';
import type { ContentModelTable, ContentModelTableRow } from 'roosterjs-content-model-types';

const MIN_HEIGHT = 22;

/**
 * @internal
 */
export function splitTableCellVertically(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let rowIndex = sel.lastRow; rowIndex >= sel.firstRow; rowIndex--) {
            const row = table.rows[rowIndex];
            const belowRow = table.rows[rowIndex + 1];

            row.cells.forEach(cell => {
                delete cell.cachedElement;
            });

            delete row.cachedElement;

            if (
                belowRow?.cells.every(
                    (belowCell, colIndex) =>
                        colIndex < sel.firstColumn ||
                        colIndex > sel.lastColumn ||
                        belowCell.spanAbove
                )
            ) {
                belowRow.cells.forEach((belowCell, colIndex) => {
                    if (colIndex >= sel.firstColumn && colIndex <= sel.lastColumn) {
                        belowCell.spanAbove = false;
                        delete belowCell.cachedElement;
                    }
                });

                delete belowRow.cachedElement;
            } else {
                const newHeight = Math.max((row.height /= 2), MIN_HEIGHT);
                const newRow: ContentModelTableRow = {
                    format: { ...row.format },
                    height: newHeight,
                    cells: row.cells.map((cell, colIndex) => {
                        const newCell = createTableCell(
                            cell.spanLeft,
                            cell.spanAbove,
                            cell.isHeader,
                            cell.format
                        );

                        newCell.dataset = { ...cell.dataset };

                        if (colIndex < sel.firstColumn || colIndex > sel.lastColumn) {
                            newCell.spanAbove = true;
                        } else {
                            newCell.isSelected = cell.isSelected;
                        }

                        return newCell;
                    }),
                };

                row.height = newHeight;
                table.rows.splice(rowIndex + 1, 0, newRow);
            }
        }
    }
}
