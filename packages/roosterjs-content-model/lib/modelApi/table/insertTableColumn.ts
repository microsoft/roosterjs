import { cloneCell } from './cloneCell';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { TableOperation } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function insertTableColumn(
    table: ContentModelTable,
    operation: TableOperation.InsertLeft | TableOperation.InsertRight
) {
    const sel = getSelectedCells(table);
    const insertLeft = operation == TableOperation.InsertLeft;

    if (sel) {
        for (let i = sel?.firstCol; i <= sel.lastCol; i++) {
            table.cells.forEach(row => {
                row.splice(
                    insertLeft ? sel.firstCol : sel.lastCol + 1,
                    0,
                    cloneCell(row[insertLeft ? sel.firstCol : sel.lastCol])
                );
            });
        }
    }
}
