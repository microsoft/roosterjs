import type { ParsedTable, TableCellCoordinate } from 'roosterjs-content-model-types';

/**
 * @internal
 * Try to find the last logic cell of a merged table cell
 * @param parsedTable The parsed table
 * @param row Row index
 * @param col Column index
 */
export function findLastedCoInMergedCell(
    parsedTable: ParsedTable,
    coordinate: TableCellCoordinate
): TableCellCoordinate | null {
    let { row, col } = coordinate;

    while (
        row >= 0 &&
        col >= 0 &&
        row < parsedTable.length &&
        col < (parsedTable[row]?.length ?? 0)
    ) {
        const right = parsedTable[row]?.[col + 1];
        const below = parsedTable[row + 1]?.[col];

        if (right == 'spanLeft' || right == 'spanBoth') {
            col++;
        } else if (below == 'spanTop' || below == 'spanBoth') {
            row++;
        } else {
            return { row, col };
        }
    }
    return null;
}
