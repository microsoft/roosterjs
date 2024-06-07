import { createTableCell, getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    ContentModelTableRow,
    ShallowMutableContentModelTable,
} from 'roosterjs-content-model-types';

const MIN_HEIGHT = 22;

/**
 * @internal
 */
export function splitTableCellVertically(table: ShallowMutableContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let rowIndex = sel.lastRow; rowIndex >= sel.firstRow; rowIndex--) {
            const row = table.rows[rowIndex];
            const belowRow = table.rows[rowIndex + 1];

            row.cells.forEach(mutateBlock);

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
                        mutateBlock(belowCell).spanAbove = false;
                    }
                });
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
