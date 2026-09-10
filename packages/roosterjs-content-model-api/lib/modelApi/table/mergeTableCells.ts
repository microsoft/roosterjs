import { canMergeCells } from './canMergeCells';
import { getSelectedCells, mutateBlock } from 'roosterjs-content-model-dom';
import type {
    BorderKey,
    ContentModelTableCellFormat,
    ShallowMutableContentModelTable,
} from 'roosterjs-content-model-types';

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
        const borderTop = getHorizontalBorder(table, sel.firstRow, sel, 'borderTop');
        const borderRight = getVerticalBorder(table, sel.lastColumn, sel, 'borderRight');
        const borderBottom = getHorizontalBorder(table, sel.lastRow, sel, 'borderBottom');
        const borderLeft = getVerticalBorder(table, sel.firstColumn, sel, 'borderLeft');

        setBorder(firstCell.format, 'borderTop', borderTop);
        setBorder(firstCell.format, 'borderRight', borderRight);
        setBorder(firstCell.format, 'borderBottom', borderBottom);
        setBorder(firstCell.format, 'borderLeft', borderLeft);

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

function getHorizontalBorder(
    table: ShallowMutableContentModelTable,
    rowIndex: number,
    sel: { firstColumn: number; lastColumn: number },
    borderKey: BorderKey
) {
    const border = table.rows[rowIndex].cells[sel.firstColumn].format[borderKey];

    return border &&
        table.rows[rowIndex].cells
            .slice(sel.firstColumn, sel.lastColumn + 1)
            .every(cell => cell.format[borderKey] == border)
        ? border
        : undefined;
}

function getVerticalBorder(
    table: ShallowMutableContentModelTable,
    columnIndex: number,
    sel: { firstRow: number; lastRow: number },
    borderKey: BorderKey
) {
    const border = table.rows[sel.firstRow].cells[columnIndex].format[borderKey];

    return border &&
        table.rows
            .slice(sel.firstRow, sel.lastRow + 1)
            .every(row => row.cells[columnIndex].format[borderKey] == border)
        ? border
        : undefined;
}

function setBorder(
    format: ContentModelTableCellFormat,
    borderKey: BorderKey,
    border: string | undefined
) {
    if (border) {
        format[borderKey] = border;
    } else {
        delete format[borderKey];
    }
}
