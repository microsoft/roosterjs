import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableRow } from '../../publicTypes/block/ContentModelTableRow';
import { createTableCell } from '../creators/createTableCell';
import { getSelectedCells } from './getSelectedCells';

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
                        colIndex < sel.firstCol || colIndex > sel.lastCol || belowCell.spanAbove
                )
            ) {
                belowRow.cells.forEach((belowCell, colIndex) => {
                    if (colIndex >= sel.firstCol && colIndex <= sel.lastCol) {
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

                        if (colIndex < sel.firstCol || colIndex > sel.lastCol) {
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
