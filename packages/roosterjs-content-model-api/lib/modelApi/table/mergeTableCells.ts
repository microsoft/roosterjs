import { canMergeCells } from './canMergeCells';
import { getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type { ShallowMutableContentModelTable } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function mergeTableCells(table: ShallowMutableContentModelTable) {
    const sel = getSelectedCells(table);

    if (
        sel &&
        canMergeCells(table.rows, sel.firstRow, sel.firstColumn, sel.lastRow, sel.lastColumn)
    ) {
        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            for (let colIndex = sel.firstColumn; colIndex <= sel.lastColumn; colIndex++) {
                const cell = table.rows[rowIndex].cells[colIndex];

                if (cell) {
                    const mutableCell = mutateBlock(cell);

                    mutableCell.spanLeft = colIndex > sel.firstColumn;
                    mutableCell.spanAbove = rowIndex > sel.firstRow;
                }
            }

            delete table.rows[rowIndex].cachedElement;
        }
    }
}
