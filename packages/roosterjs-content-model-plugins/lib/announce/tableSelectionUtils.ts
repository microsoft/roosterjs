import type { TableSelectionInfo, TableSelection } from 'roosterjs-content-model-types';

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
                const cell = parsedTable[r] && parsedTable[r][c];
                if (cell && typeof cell != 'string') {
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
 * @param prevTableSelection Previous table selection object containing firstRow, lastRow, firstColumn, and lastColumn properties
 * @param firstCo Current first coordinate of the selection (with row, col properties)
 * @param lastCo Current last coordinate of the selection (with row, col properties)
 * @returns 'selecting' if expanding selection, 'unselecting' if contracting, or null if no change
 */
export function getIsSelectingOrUnselecting(
    prevTableSelection: TableSelection | null,
    newTableSelection: TableSelection
): 'selecting' | 'unselecting' | null {
    if (!prevTableSelection) {
        return 'selecting';
    }

    const {
        firstRow: prevFirstRow,
        lastRow: prevLastRow,
        firstColumn: prevFirstColumn,
        lastColumn: prevLastColumn,
    } = prevTableSelection;

    const {
        firstRow: newFirstRow,
        lastRow: newLastRow,
        firstColumn: newFirstColumn,
        lastColumn: newLastColumn,
    } = newTableSelection;

    const prevRowSpan = Math.abs(prevLastRow - prevFirstRow) + 1;
    const prevColSpan = Math.abs(prevLastColumn - prevFirstColumn) + 1;
    const prevArea = prevRowSpan * prevColSpan;

    const newRowSpan = Math.abs(newLastRow - newFirstRow) + 1;
    const newColSpan = Math.abs(newLastColumn - newFirstColumn) + 1;
    const newArea = newRowSpan * newColSpan;

    // Check if selections are identical
    if (
        prevFirstRow === newFirstRow &&
        prevLastRow === newLastRow &&
        prevFirstColumn === newFirstColumn &&
        prevLastColumn === newLastColumn
    ) {
        return null;
    }

    if (newArea > prevArea) {
        return 'selecting';
    } else if (newArea < prevArea) {
        return 'unselecting';
    } else {
        // Same area but different positions
        return 'selecting';
    }

    if (
        prevFirstColumn !== newFirstColumn ||
        prevFirstRow !== newFirstRow ||
        prevLastColumn !== newLastColumn ||
        prevLastRow !== newLastRow
    ) {
        return 'selecting';
    }

    return null;
}
