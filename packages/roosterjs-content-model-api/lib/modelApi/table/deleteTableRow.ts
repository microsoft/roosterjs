import { collapseTableSelection } from '../selection/collapseTableSelection';
import { getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type { ShallowMutableContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function deleteTableRow(table: ShallowMutableContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        table.rows[sel.firstRow].cells.forEach((cell, colIndex) => {
            const cellInNextCell = table.rows[sel.lastRow + 1]?.cells[colIndex];

            if (cellInNextCell) {
                mutateBlock(cellInNextCell).spanAbove = cellInNextCell.spanAbove && cell.spanAbove;
            }
        });

        table.rows.splice(sel.firstRow, sel.lastRow - sel.firstRow + 1);

        collapseTableSelection(table.rows, sel);
    }
}
