import type { ParsedTable, TableCellCoordinate } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export interface TableCellCoordinateWithCell extends TableCellCoordinate {
    cell: HTMLTableCellElement;
}

/**
 * @internal
 * Try to find a TD/TH element from the given row and col number from the given parsed table
 * @param parsedTable The parsed table
 * @param row Row index
 * @param col Column index
 * @param findLast True to find last merged cell instead of the first cell
 */
export function findTableCellElement(
    parsedTable: ParsedTable,
    coordinate: TableCellCoordinate
): TableCellCoordinateWithCell | null {
    let { row, col } = coordinate;

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
            return { cell, row, col };
        } else if (cell == 'spanLeft' || cell == 'spanBoth') {
            col--;
        } else {
            row--;
        }
    }
    return null;
}
