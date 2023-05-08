import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createTableCell } from '../creators/createTableCell';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export function insertTableRow(
    table: ContentModelTable,
    operation:
        | TableOperation.InsertAbove
        | TableOperation.InsertBelow
        | CompatibleTableOperation.InsertAbove
        | CompatibleTableOperation.InsertBelow
) {
    const sel = getSelectedCells(table);
    const insertAbove = operation == TableOperation.InsertAbove;

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
