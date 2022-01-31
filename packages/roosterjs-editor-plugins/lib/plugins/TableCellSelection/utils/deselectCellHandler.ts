import { forEachCell } from './forEachCell';
import { safeInstanceOf, VTable } from 'roosterjs-editor-dom';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';

/**
 * @internal
 * Handler to remove the selected style
 * @param cell element to apply the style
 */
export function deselectCellHandler(cell: HTMLElement) {
    if (
        cell &&
        safeInstanceOf(cell, 'HTMLTableCellElement') &&
        cell.classList.contains(tableCellSelectionCommon.TABLE_CELL_SELECTED)
    ) {
        cell.classList.remove(tableCellSelectionCommon.TABLE_CELL_SELECTED);
        cell.querySelectorAll('table').forEach(table => {
            const vTable2 = new VTable(table);
            forEachCell(vTable2, cell => deselectCellHandler(cell.td));
        });
    }
}
