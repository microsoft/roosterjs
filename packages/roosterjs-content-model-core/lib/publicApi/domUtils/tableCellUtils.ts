import { toArray } from 'roosterjs-content-model-dom';
import type { TableSelection } from 'roosterjs-content-model-types';

/**
 * Parse a table into a two dimensions array of TD elements. For those merged cells, the value will be null.
 * @param table Input HTML Table element
 * @returns Array of TD elements
 */
export function parseTableCells(table: HTMLTableElement): (HTMLTableCellElement | null)[][] {
    const trs = toArray(table.rows);
    const cells: (HTMLTableCellElement | null)[][] = trs.map(row => []);

    trs.forEach((tr, rowIndex) => {
        for (let sourceCol = 0, targetCol = 0; sourceCol < tr.cells.length; sourceCol++) {
            // Skip the cells which already initialized
            for (; cells[rowIndex][targetCol] !== undefined; targetCol++) {}

            const td = tr.cells[sourceCol];

            for (let colSpan = 0; colSpan < td.colSpan; colSpan++, targetCol++) {
                for (let rowSpan = 0; rowSpan < td.rowSpan; rowSpan++) {
                    if (cells[rowIndex + rowSpan]) {
                        cells[rowIndex + rowSpan][targetCol] =
                            colSpan == 0 && rowSpan == 0 ? td : null;
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

/**
 * Create ranges from a table selection
 * @param selection The source table selection
 * @returns An array of DOM ranges of selected table cells
 */
export function createTableRanges(selection: TableSelection): Range[] {
    const result: Range[] = [];
    const { table, firstColumn, firstRow, lastColumn, lastRow } = selection;
    const cells = parseTableCells(table);

    for (let row = firstRow; row <= lastRow; row++) {
        for (let col = firstColumn; col <= lastColumn; col++) {
            const td = cells[row]?.[col];

            if (td) {
                const range = table.ownerDocument.createRange();

                range.selectNode(td);
                result.push(range);
            }
        }
    }

    return result;
}
