import { cloneTableCell } from './cloneTableCell';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export function insertTableColumn(
    table: ContentModelTable,
    operation:
        | TableOperation.InsertLeft
        | TableOperation.InsertRight
        | CompatibleTableOperation.InsertLeft
        | CompatibleTableOperation.InsertRight
) {
    const sel = getSelectedCells(table);
    const insertLeft = operation == TableOperation.InsertLeft;

    if (sel) {
        for (let i = sel?.firstCol; i <= sel.lastCol; i++) {
            table.cells.forEach(row => {
                row.splice(
                    insertLeft ? sel.firstCol : sel.lastCol + 1,
                    0,
                    cloneTableCell(row[insertLeft ? sel.firstCol : sel.lastCol])
                );
            });
        }
    }
}
