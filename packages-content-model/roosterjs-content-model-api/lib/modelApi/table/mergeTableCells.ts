import { canMergeCells } from './canMergeCells';
import { getSelectedCells } from 'roosterjs-content-model-core';
import type { ContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergeTableCells(table: ContentModelTable) {
    const sel = getSelectedCells(table);

    if (
        sel &&
        canMergeCells(table.rows, sel.firstRow, sel.firstColumn, sel.lastRow, sel.lastColumn)
    ) {
        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            for (let colIndex = sel.firstColumn; colIndex <= sel.lastColumn; colIndex++) {
                const cell = table.rows[rowIndex].cells[colIndex];

                if (cell) {
                    cell.spanLeft = colIndex > sel.firstColumn;
                    cell.spanAbove = rowIndex > sel.firstRow;

                    delete cell.cachedElement;
                }
            }

            delete table.rows[rowIndex].cachedElement;
        }
    }
}
