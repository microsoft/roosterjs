/**
 * Represents a selection made inside of a table
 */
export default interface TableSelection {
    /**
     * Column of the first cell selected
     */
    firstCol: number;
    /**
     * Row of the first cell selected
     */
    firstRow: number;
    /**
     * Column of the last cell selected
     */
    lastCol: number;
    /**
     * Row of the last cell selected
     */
    lastRow: number;
}
