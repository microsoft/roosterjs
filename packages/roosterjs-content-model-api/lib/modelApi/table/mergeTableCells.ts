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
        const firstCell = mutateBlock(table.rows[sel.firstRow].cells[sel.firstColumn]);
        const borderRight = table.rows[sel.firstRow].cells[sel.lastColumn].format.borderRight;
        const borderBottom = table.rows[sel.lastRow].cells[sel.firstColumn].format.borderBottom;

        if (borderRight) {
            firstCell.format.borderRight = borderRight;
        } else {
            delete firstCell.format.borderRight;
        }

        if (borderBottom) {
            firstCell.format.borderBottom = borderBottom;
        } else {
            delete firstCell.format.borderBottom;
        }

        for (let rowIndex = sel.firstRow; rowIndex <= sel.lastRow; rowIndex++) {
            for (let colIndex = sel.firstColumn; colIndex <= sel.lastColumn; colIndex++) {
                const cell = table.rows[rowIndex].cells[colIndex];

                if (cell) {
                    const mutableCell = mutateBlock(cell);

                    mutableCell.spanLeft = colIndex > sel.firstColumn;
                    mutableCell.spanAbove = rowIndex > sel.firstRow;
                }
            }
        }
    }
}
