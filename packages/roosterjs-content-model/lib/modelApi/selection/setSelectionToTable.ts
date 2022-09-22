import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';

/**
 * @internal
 */
export interface TableSelectionCoordinates {
    firstRow: number;
    firstCol: number;
    lastRow: number;
    lastCol: number;
}

/**
 * @internal
 */
export function setSelectionToTable(
    cells: ContentModelTableCell[][],
    selection: TableSelectionCoordinates
) {
    const { firstCol, firstRow, lastCol, lastRow } = selection;

    for (let row = 0; row < cells.length; row++) {
        for (let col = 0; col < cells[row].length; col++) {
            cells[row][col].isSelected =
                row >= firstRow && row <= lastRow && col >= firstCol && col <= lastCol;
        }
    }
}
