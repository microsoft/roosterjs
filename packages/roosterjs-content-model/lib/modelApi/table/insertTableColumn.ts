import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createTableCell } from '../creators/createTableCell';
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
