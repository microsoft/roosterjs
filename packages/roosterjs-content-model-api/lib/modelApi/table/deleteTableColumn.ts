import { collapseTableSelection } from '../selection/collapseTableSelection';
import { getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type { ShallowMutableContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function deleteTableColumn(table: ShallowMutableContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
            const cellInNextCol = table.rows[rowIndex].cells[sel.lastColumn + 1];

            if (cellInNextCol) {
                mutateBlock(cellInNextCol).spanLeft =
                    cellInNextCol.spanLeft && table.rows[rowIndex].cells[sel.firstColumn].spanLeft;
            }

            table.rows[rowIndex].cells.splice(
                sel.firstColumn,
                sel.lastColumn - sel.firstColumn + 1
            );
        }

        table.widths.splice(sel.firstColumn, sel.lastColumn - sel.firstColumn + 1);
        collapseTableSelection(table.rows, sel);
    }
}
