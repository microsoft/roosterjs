import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { setSelectionToTable } from '../selection/setSelectionToTable';

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

        setSelectionToTable(table.cells, sel);
    }
}
