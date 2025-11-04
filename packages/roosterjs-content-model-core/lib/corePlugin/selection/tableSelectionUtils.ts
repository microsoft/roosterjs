import { Coordinates } from 'roosterjs-editor-types';
import type { TableSelectionInfo, TableCellCoordinate } from 'roosterjs-content-model-types';

/**
 * @internal
 * Retrieves text content from selected table cells in a parsed table structure
 * @param tsInfo Table selection information containing the parsed table and coordinates
 * @returns Combined text content from all selected cells, separated by spaces
 */
export function retrieveStringFromParsedTable(tsInfo: TableSelectionInfo): string {
    const { parsedTable, firstCo, lastCo } = tsInfo;
    let result = '';

    if (lastCo) {
        for (let r = firstCo.row; r <= lastCo.row; r++) {
            for (let c = firstCo.col; c <= lastCo.col; c++) {
                const cell = parsedTable[r][c];
                if (typeof cell != 'string') {
                    result += ' ' + cell.innerText + ',';
                }
            }
        }
    }

    return result;
}

/**
 * @internal
 * Determines whether the table selection is expanding (selecting more) or contracting (selecting less)
 * @param prevFirstCo Previous first coordinate of the selection (with x, y properties)
 * @param prevLastCo Previous last coordinate of the selection (with x, y properties)
 * @param firstCo Current first coordinate of the selection (with row, col properties)
 * @param lastCo Current last coordinate of the selection (with row, col properties)
 * @returns 'selecting' if expanding selection, 'unselecting' if contracting, or null if no change
 */
export function getIsSelectingOrUnselecting(
    prevFirstCo: Coordinates,
    prevLastCo: Coordinates,
    firstCo: TableCellCoordinate,
    lastCo: TableCellCoordinate
): 'selecting' | 'unselecting' | null {
    const prevRowSpan = Math.abs(prevLastCo.y - prevFirstCo.y) + 1;
    const prevColSpan = Math.abs(prevLastCo.x - prevFirstCo.x) + 1;
    const prevArea = prevRowSpan * prevColSpan;

    const newRowSpan = Math.abs(lastCo.row - firstCo.row) + 1;
    const newColSpan = Math.abs(lastCo.col - firstCo.col) + 1;
    const newArea = newRowSpan * newColSpan;

    if (newArea > prevArea || newArea === prevArea) {
        return 'selecting';
    } else if (newArea < prevArea) {
        return 'unselecting';
    }

    if (
        prevFirstCo.x !== firstCo.col ||
        prevFirstCo.y !== firstCo.row ||
        prevLastCo.x !== lastCo.col ||
        prevLastCo.y !== lastCo.row
    ) {
        return 'selecting';
    }

    return null;
}
