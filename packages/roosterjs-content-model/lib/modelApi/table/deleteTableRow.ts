import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getSelectedCells } from './getSelectedCells';
import { setSelectionToTable } from '../selection/setSelectionToTable';

/**
 * @internal
 */
export function deleteTableRow(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel) {
        table.cells[sel.firstRow].forEach((cell, colIndex) => {
            const cellInNextRow = table.cells[sel.lastRow + 1]?.[colIndex];

            if (cellInNextRow) {
                cellInNextRow.spanAbove = cellInNextRow.spanAbove && cell.spanAbove;
            }
        });
        table.cells.splice(sel.firstRow, sel.lastRow - sel.firstRow + 1);

        setSelectionToTable(table.cells, sel);
    }
}
