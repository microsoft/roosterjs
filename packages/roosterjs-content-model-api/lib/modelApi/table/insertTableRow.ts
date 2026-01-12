import { clearSelectedCells } from './clearSelectedCells';
import { copyPreviousCellSegmentFormat } from './copyPreviousCellSegmentFormat';
import { createTableCell, getSelectedCells } from 'roosterjs-content-model-dom';
import type {
    ShallowMutableContentModelTable,
    TableVerticalInsertOperation,
} from 'roosterjs-content-model-types';

/**
 * Insert a row to the table
 * @param table The table model where the row is to be inserted
 * @param operation The operation to be performed
 */
export function insertTableRow(
    table: ShallowMutableContentModelTable,
    operation: TableVerticalInsertOperation
) {
    const sel = getSelectedCells(table);
    const insertAbove = operation == 'insertAbove';

    if (sel) {
        clearSelectedCells(table, sel);

        for (let i = sel.firstRow; i <= sel.lastRow; i++) {
            const sourceRow = table.rows[insertAbove ? sel.firstRow : sel.lastRow];

            table.rows.splice(insertAbove ? sel.firstRow : sel.lastRow + 1, 0, {
                format: { ...sourceRow.format },
                cells: sourceRow.cells.map(cell => {
                    const newCell = createTableCell(
                        cell.spanLeft,
                        cell.spanAbove,
                        cell.isHeader,
                        cell.format,
                        cell.dataset
                    );
                    copyPreviousCellSegmentFormat(cell, newCell);
                    newCell.isSelected = true;
                    return newCell;
                }),
                height: sourceRow.height,
            });
        }
    }
}
