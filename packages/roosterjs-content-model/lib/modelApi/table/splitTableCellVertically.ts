import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
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
            const row = table.cells[rowIndex];
            const belowRow = table.cells[rowIndex + 1];

            if (
                belowRow?.every(
                    (belowCell, colIndex) =>
                        colIndex < sel.firstCol || colIndex > sel.lastCol || belowCell.spanAbove
                )
            ) {
                belowRow.forEach((belowCell, colIndex) => {
                    if (colIndex >= sel.firstCol && colIndex <= sel.lastCol) {
                        const cell = row[colIndex];

                        belowCell.spanAbove = false;

                        if (cell.format.height) {
                            // Delete existing height to let other cells determine the height
                            delete belowCell.format.height;
                            delete cell.format.height;
                        }
                    }
                });
            } else {
                const newRow = row.map((cell, colIndex) => {
                    const newCell = createTableCell(
                        cell.spanLeft,
                        cell.spanAbove,
                        cell.isHeader,
                        cell.format
                    );

                    if (colIndex < sel.firstCol || colIndex > sel.lastCol) {
                        newCell.spanAbove = true;
                        if (newCell.format.height) {
                            newCell.format.height = 0;
                        }
                    } else {
                        const newHeight = Math.max((cell.format.height! /= 2), MIN_HEIGHT);
                        cell.format.height = newHeight;
                        newCell.format.height = newHeight;
                        newCell.isSelected = cell.isSelected;
                    }

                    return newCell;
                });

                table.cells.splice(rowIndex + 1, 0, newRow);
            }
        }
    }
}
