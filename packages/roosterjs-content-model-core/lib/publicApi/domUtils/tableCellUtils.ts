import { toArray } from 'roosterjs-content-model-dom';
import type { DOMHelper, ParsedTable, TableSelection } from 'roosterjs-content-model-types';

const TableCellSelector = 'TH,TD';

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

/**
 * @internal
 * Try to find a TD/TH element from the given row and col number from the given parsed table
 * @param parsedTable The parsed table
 * @param row Row index
 * @param col Column index
 */
export function findTableCellElement(
    parsedTable: ParsedTable,
    row: number,
    col: number
): HTMLTableCellElement | null {
    while (
        row >= 0 &&
        col >= 0 &&
        row < parsedTable.length &&
        col < (parsedTable[row]?.length ?? 0)
    ) {
        const cell = parsedTable[row]?.[col];

        if (!cell) {
            break;
        } else if (typeof cell == 'object') {
            return cell;
        } else if (cell == 'spanLeft' || cell == 'spanBoth') {
            col--;
        } else {
            row--;
        }
    }
    return null;
}

/**
 * @internal
 * Find coordinate of a given element from a parsed table
 */
export function findCoordinate(
    parsedTable: ParsedTable,
    element: Node,
    domHelper: DOMHelper
): [number, number] | null {
    const td = domHelper.findClosestElementAncestor(element, TableCellSelector);
    let result: [number, number] | null = null;

    // Try to do a fast check if both TD are in the given TABLE
    if (td) {
        parsedTable.some((row, rowIndex) => {
            const colIndex = td ? row.indexOf(td as HTMLTableCellElement) : -1;

            return (result = colIndex >= 0 ? [rowIndex, colIndex] : null);
        });
    }

    // For nested table scenario, try to find the outer TAble cells
    if (!result) {
        parsedTable.some((row, rowIndex) => {
            const colIndex = row.findIndex(
                cell => typeof cell == 'object' && cell.contains(element)
            );

            return (result = colIndex >= 0 ? [rowIndex, colIndex] : null);
        });
    }

    return result;
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

            if (typeof td == 'object') {
                const range = table.ownerDocument.createRange();

                range.selectNode(td);
                result.push(range);
            }
        }
    }

    return result;
}
