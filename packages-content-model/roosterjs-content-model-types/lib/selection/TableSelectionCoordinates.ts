/**
 * Coordinates of table selection
 */
export interface TableSelectionCoordinates {
    /**
     * Index of the first selected row, start from 0
     */
    firstRow: number;

    /**
     * Index of the first selected column, start from 0
     */
    firstColumn: number;

    /**
     * Index of the last selected row, start from 0
     */
    lastRow: number;

    /**
     * Index of the last selected column, start from 0
     */
    lastColumn: number;
}
