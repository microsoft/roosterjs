import { canMergeCells } from './canMergeCells';
import { getSelectedCells } from './getSelectedCells';
import type { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergeTableCells(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (sel && canMergeCells(table.rows, sel.firstRow, sel.firstCol, sel.lastRow, sel.lastCol)) {
        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            for (let colIndex = sel.firstCol; colIndex <= sel.lastCol; colIndex++) {
                const cell = table.rows[rowIndex].cells[colIndex];

                if (cell) {
                    cell.spanLeft = colIndex > sel.firstCol;
                    cell.spanAbove = rowIndex > sel.firstRow;

                    delete cell.cachedElement;
                }
            }

            delete table.rows[rowIndex].cachedElement;
        }
    }
}
