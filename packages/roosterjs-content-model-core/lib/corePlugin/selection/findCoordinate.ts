import type { DOMHelper, ParsedTable, TableCellCoordinate } from 'roosterjs-content-model-types';

const TableCellSelector = 'TH,TD';

/**
 * @internal
 * Find coordinate of a given element from a parsed table
 */
export function findCoordinate(
    parsedTable: ParsedTable,
    element: Node,
    domHelper: DOMHelper
): TableCellCoordinate | null {
    const td = domHelper.findClosestElementAncestor(element, TableCellSelector);
    let result: TableCellCoordinate | null = null;

    // Try to do a fast check if both TD are in the given TABLE
    if (td) {
        parsedTable.some((row, rowIndex) => {
            const colIndex = td ? row.indexOf(td as HTMLTableCellElement) : -1;

            return (result = colIndex >= 0 ? { row: rowIndex, col: colIndex } : null);
        });
    }

    // For nested table scenario, try to find the outer TAble cells
    if (!result) {
        parsedTable.some((row, rowIndex) => {
            const colIndex = row.findIndex(
                cell => typeof cell == 'object' && cell.contains(element)
            );

            return (result = colIndex >= 0 ? { row: rowIndex, col: colIndex } : null);
        });
    }

    return result;
}
