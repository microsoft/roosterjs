import { collapseTableSelection } from '../selection/collapseTableSelection';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';

/**
 * @internal
 */
export function deleteTableColumn(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
            const cellInNextCol = table.rows[rowIndex].cells[sel.lastCol + 1];

            if (cellInNextCol) {
                cellInNextCol.spanLeft =
                    cellInNextCol.spanLeft && table.rows[rowIndex].cells[sel.firstCol].spanLeft;
            }

            table.rows[rowIndex].cells.splice(sel.firstCol, sel.lastCol - sel.firstCol + 1);
        }

        table.widths.splice(sel.firstCol, sel.lastCol - sel.firstCol + 1);
        collapseTableSelection(table.rows, sel);
    }
}
