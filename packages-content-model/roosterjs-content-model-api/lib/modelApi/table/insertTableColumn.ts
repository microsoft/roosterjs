import { createTableCell } from 'roosterjs-content-model-dom';
import { getSelectedCells } from './getSelectedCells';
import type {
    ContentModelTable,
    TableHorizontalInsertOperation,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function insertTableColumn(
    table: ContentModelTable,
    operation: TableHorizontalInsertOperation
) {
    const sel = getSelectedCells(table);
    const insertLeft = operation == 'insertLeft';

    if (sel) {
        for (let i = sel?.firstCol; i <= sel.lastCol; i++) {
            table.rows.forEach(row => {
                const cell = row.cells[insertLeft ? sel.firstCol : sel.lastCol];

                row.cells.splice(
                    insertLeft ? sel.firstCol : sel.lastCol + 1,
                    0,
                    createTableCell(cell.spanLeft, cell.spanAbove, cell.isHeader, cell.format)
                );
            });
            table.widths.splice(
                insertLeft ? sel.firstCol : sel.lastCol + 1,
                0,
                table.widths[insertLeft ? sel.firstCol : sel.lastCol]
            );
        }
    }
}
