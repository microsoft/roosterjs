import { collapseTableSelection } from '../selection/collapseTableSelection';
import { getSelectedCells } from './getSelectedCells';
import type { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function deleteTableRow(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        table.rows[sel.firstRow].cells.forEach((cell, colIndex) => {
            const cellInNextRow = table.rows[sel.lastRow + 1]?.cells[colIndex];

            if (cellInNextRow) {
                cellInNextRow.spanAbove = cellInNextRow.spanAbove && cell.spanAbove;
            }
        });

        table.rows.splice(sel.firstRow, sel.lastRow - sel.firstRow + 1);

        collapseTableSelection(table.rows, sel);
    }
}
