import { deselectCellHandler } from './deselectCellHandler';
import { forEachCell } from './forEachCell';
import { removeSelectionStyle } from './removeSelectionStyle';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Removes the selection of all the tables
 */
export function deSelectAll(vTable: VTable): void {
    forEachCell(vTable, cell => {
        if (cell.td) {
            deselectCellHandler(cell.td);
        }
    });
    if (vTable.table?.classList.contains(tableCellSelectionCommon.TABLE_SELECTED)) {
        vTable.table.classList.remove(tableCellSelectionCommon.TABLE_SELECTED);
    }

    removeSelectionStyle(vTable.table);
}
