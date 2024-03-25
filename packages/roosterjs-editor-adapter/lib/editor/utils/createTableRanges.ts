import { parseTableCells } from 'roosterjs-content-model-dom';
import type { TableSelection } from 'roosterjs-content-model-types';

/**
 * @internal Export for test only
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

            if (typeof td == 'object') {
                const range = table.ownerDocument.createRange();

                range.selectNode(td);
                result.push(range);
            }
        }
    }

    return result;
}
