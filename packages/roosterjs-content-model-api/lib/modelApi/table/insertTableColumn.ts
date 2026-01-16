import { clearSelectedCells } from './clearSelectedCells';
import { copyPreviousCellSegmentFormat } from './copyPreviousCellSegmentFormat';
import { createTableCell, getSelectedCells } from 'roosterjs-content-model-dom';
import type {
    ShallowMutableContentModelTable,
    TableHorizontalInsertOperation,
} from 'roosterjs-content-model-types';

/**
 * Insert a column to the table
 * @param table The table model where the column is to be inserted
 * @param operation The operation to be performed
 */
export function insertTableColumn(
    table: ShallowMutableContentModelTable,
    operation: TableHorizontalInsertOperation
) {
    const sel = getSelectedCells(table);
    const insertLeft = operation == 'insertLeft';

    if (sel) {
        clearSelectedCells(table, sel);
        for (let i = sel?.firstColumn; i <= sel.lastColumn; i++) {
            table.rows.forEach(row => {
                const cell = row.cells[insertLeft ? sel.firstColumn : sel.lastColumn];

                const newCell = createTableCell(
                    cell.spanLeft,
                    cell.spanAbove,
                    cell.isHeader,
                    cell.format,
                    cell.dataset
                );
                copyPreviousCellSegmentFormat(cell, newCell);
                newCell.isSelected = true;

                row.cells.splice(insertLeft ? sel.firstColumn : sel.lastColumn + 1, 0, newCell);
            });
            table.widths.splice(
                insertLeft ? sel.firstColumn : sel.lastColumn + 1,
                0,
                table.widths[insertLeft ? sel.firstColumn : sel.lastColumn]
            );
        }
    }
}
