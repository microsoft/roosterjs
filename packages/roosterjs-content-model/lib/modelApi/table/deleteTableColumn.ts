import { collapseTableSelection } from '../selection/collapseTableSelection';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';

/**
 * @internal
 */
export function deleteTableColumn(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        for (let rowIndex = 0; rowIndex < table.cells.length; rowIndex++) {
            const cellInNextCol = table.cells[rowIndex][sel.lastCol + 1];

            if (cellInNextCol) {
                cellInNextCol.spanLeft =
                    cellInNextCol.spanLeft && table.cells[rowIndex][sel.firstCol].spanLeft;
            }

            table.cells[rowIndex].splice(sel.firstCol, sel.lastCol - sel.firstCol + 1);
        }

        table.widths.splice(sel.firstCol, sel.lastCol - sel.firstCol + 1);
        collapseTableSelection(table.cells, sel);
    }
}
