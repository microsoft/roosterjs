import { createTableCell } from 'roosterjs-content-model-dom';
import { getSelectedCells } from './getSelectedCells';
import type {
    ContentModelTable,
    TableVerticalInsertOperation,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function insertTableRow(table: ContentModelTable, operation: TableVerticalInsertOperation) {
    const sel = getSelectedCells(table);
    const insertAbove = operation == 'insertAbove';

    if (sel) {
        for (let i = sel.firstRow; i <= sel.lastRow; i++) {
            const sourceRow = table.rows[insertAbove ? sel.firstRow : sel.lastRow];

            table.rows.splice(insertAbove ? sel.firstRow : sel.lastRow + 1, 0, {
                format: { ...sourceRow.format },
                cells: sourceRow.cells.map(cell =>
                    createTableCell(cell.spanLeft, cell.spanAbove, cell.isHeader, cell.format)
                ),
                height: sourceRow.height,
            });
        }
    }
}
