import TableFormat from './TableFormat';
import VCell from './VCell';
import { TableOperation } from '../enum/TableOperation';

/**
 * A virtual table class, represent an HTML table, by expand all merged cells to each separated cells
 */
export default interface IVTable {
    /**
     * The HTML table object
     */
    table: HTMLTableElement;

    /**
     * Virtual cells
     */
    cells: VCell[][];

    /**
     * Current row index
     */
    row: number;

    /**
     * Current column index
     */
    col: number;

    /**
     * Start of the  Selection Range
     */
    startRange: number[];

    /**
     * End of the  Selection Range
     */
    endRange: number[];

    /**
     * Write the virtual table back to DOM tree to represent the change of VTable
     */
    writeBack(): void;

    /**
     * Apply the given table format to this virtual table
     * @param format Table format to apply
     */
    applyFormat(format: Partial<TableFormat>): void;

    /**
     * Edit table with given operation.
     * @param operation Table operation
     */
    edit(operation: TableOperation): void;

    /**
     * Loop each cell of current column and invoke a callback function
     * @param callback The callback function to invoke
     */
    forEachCellOfCurrentColumn(callback: (cell: VCell, row: VCell[], i: number) => any): void;

    /**
     * Loop each table cell and get all the cells that share the same border from one side
     * The result is an array of table cell elements
     * @param borderPos The position of the border
     * @param getLeftCells Get left-hand-side or right-hand-side cells of the border
     *
     * Example, consider having a 3 by 4 table as below with merged and split cells
     *
     *     | 1 | 4 | 7 | 8 |
     *     |   5   |   9   |
     *     |   3   |   10  |
     *
     *  input => borderPos: the 3rd border, getLeftCells: true
     *  output => [4, 5, 3]
     *
     *  input => borderPos: the 3rd border, getLeftCells: false
     *  output => [7, 9, 10]
     *
     *  input => borderPos: the 2nd border, getLeftCells: true
     *  output => [1]
     *
     *  input => borderPos: the 2nd border, getLeftCells: false
     *  output => [4]
     */
    getCellsWithBorder(borderPos: number, getLeftCells: boolean): HTMLTableCellElement[];

    /**
     * Loop each cell of current row and invoke a callback function
     * @param callback The callback function to invoke
     */
    forEachCellOfCurrentRow(callback: (cell: VCell, i: number) => any): void;

    /**
     * Get a table cell using its row and column index. This function will always return an object
     * even if the given indexes don't exist in table.
     * @param row The row index
     * @param col The column index
     */
    getCell(row: number, col: number): VCell;

    /**
     * Get current HTML table cell object. If the current table cell is a virtual expanded cell, return its root cell
     */
    getCurrentTd(): HTMLTableCellElement;

    /**
     * Get the TableCell in a provided coordinate
     * @param row
     * @param col
     */
    getTd(row: number, col: number): HTMLTableCellElement;

    /**
     * Transforms the selected cells to Ranges.
     * For Each Row a Range with selected cells, a Range is going to be returned.
     * @returns
     */
    getSelectedRanges(): Range[];
}
