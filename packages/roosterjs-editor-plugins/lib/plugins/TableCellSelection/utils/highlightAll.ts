import { forEachCell } from './forEachCell';
import { highlightCellHandler } from './highlightCellHandler';
import { insertSelectionStyle } from './insertSelectionStyle';
import { tableCellSelectionCommon } from './tableCellSelectionCommon';
import { VTable } from 'roosterjs-editor-dom';

/**
 * @internal
 * Highlights all the cells in the table.
 */
export function highlightAll(vTable: VTable): void {
    let firstCol: number = null;
    let firstRow: number = null;
    let lastCol: number;
    let lastRow: number;
    if (!vTable.table.classList.contains(tableCellSelectionCommon.TABLE_SELECTED)) {
        vTable.table.classList.add(tableCellSelectionCommon.TABLE_SELECTED);
    }
    forEachCell(vTable, (cell, x, y) => {
        if (cell.td) {
            highlightCellHandler(cell.td);

            firstCol = firstCol ?? x;
            firstRow = firstRow ?? y;
            lastCol = x;
            lastRow = y;
        }
    });

    vTable.selection = {
        firstCell: {
            x: firstCol,
            y: firstRow,
        },
        lastCell: {
            x: lastCol,
            y: lastRow,
        },
    };

    insertSelectionStyle(vTable.table);
}
