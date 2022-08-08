import { cloneCell } from './cloneCell';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function insertTableRow(
    table: ContentModelTable,
    operation: TableOperation.InsertAbove | TableOperation.InsertBelow
) {
    const sel = getSelectedCells(table);
    const insertAbove = operation == TableOperation.InsertAbove;

    if (sel) {
        for (let i = sel.firstRow; i <= sel.lastRow; i++) {
            table.cells.splice(
                insertAbove ? sel.firstRow : sel.lastRow + 1,
                0,
                table.cells[insertAbove ? sel.firstRow : sel.lastRow].map(cloneCell)
            );
        }
    }
}
