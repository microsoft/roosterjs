import { toArray } from '../toArray';
import type { ParsedTable } from 'roosterjs-content-model-types';

/**
 * Parse a table into a two dimensions array of TD elements. For those merged cells, the value will be null.
 * @param table Input HTML Table element
 * @returns Array of TD elements
 */
export function parseTableCells(table: HTMLTableElement): ParsedTable {
    const trs = toArray(table.rows);
    const cells: ParsedTable = trs.map(row => []);

    trs.forEach((tr, rowIndex) => {
        for (let sourceCol = 0, targetCol = 0; sourceCol < tr.cells.length; sourceCol++) {
            // Skip the cells which already initialized
            for (; cells[rowIndex][targetCol] !== undefined; targetCol++) {}

            const td = tr.cells[sourceCol];

            for (let colSpan = 0; colSpan < td.colSpan; colSpan++, targetCol++) {
                for (let rowSpan = 0; rowSpan < td.rowSpan; rowSpan++) {
                    if (cells[rowIndex + rowSpan]) {
                        cells[rowIndex + rowSpan][targetCol] =
                            colSpan == 0
                                ? rowSpan == 0
                                    ? td
                                    : 'spanTop'
                                : rowSpan == 0
                                ? 'spanLeft'
                                : 'spanBoth';
                    }
                }
            }
        }

        for (let col = 0; col < cells[rowIndex].length; col++) {
            cells[rowIndex][col] = cells[rowIndex][col] || null;
        }
    });

    return cells;
}
