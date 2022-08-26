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
            table.cells.splice(
                insertAbove ? sel.firstRow : sel.lastRow + 1,
                0,
                table.cells[insertAbove ? sel.firstRow : sel.lastRow].map(cell =>
                    createTableCell(cell.spanLeft, cell.spanAbove, cell.isHeader, cell.format)
                )
            );
            table.heights.splice(
                insertAbove ? sel.firstRow : sel.lastRow + 1,
                0,
                table.heights[insertAbove ? sel.firstRow : sel.lastRow]
            );
        }
    }
}
