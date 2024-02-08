import { createTableCell } from 'roosterjs-content-model-dom';
import { getSelectedCells } from 'roosterjs-content-model-core';
import type {
    ContentModelTable,
    TableHorizontalInsertOperation,
} from 'roosterjs-content-model-types';

/**
 * Insert a column to the table
 */
export function insertTableColumn(
    table: ContentModelTable,
    operation: TableHorizontalInsertOperation
) {
    const sel = getSelectedCells(table);
    const insertLeft = operation == 'insertLeft';

    if (sel) {
        for (let i = sel?.firstColumn; i <= sel.lastColumn; i++) {
            table.rows.forEach(row => {
                const cell = row.cells[insertLeft ? sel.firstColumn : sel.lastColumn];

                row.cells.splice(
                    insertLeft ? sel.firstColumn : sel.lastColumn + 1,
                    0,
                    createTableCell(
                        cell.spanLeft,
                        cell.spanAbove,
                        cell.isHeader,
                        cell.format,
                        cell.dataset
                    )
                );
            });
            table.widths.splice(
                insertLeft ? sel.firstColumn : sel.lastColumn + 1,
                0,
                table.widths[insertLeft ? sel.firstColumn : sel.lastColumn]
            );
        }
    }
}
