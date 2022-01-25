import Coordinates from './Coordinates';
import TableFormat from './TableFormat';
import TableSelection from './TableSelection';
import VCell from './VCell';
import { TableOperation } from '../enum/TableOperation';

/**
 * A virtual table class, represent an HTML table, by expand all merged cells to each separated cells
 */
export default interface Table {
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
     * Selected range of cells with the coordinates of the first and last cell selected.
     */
    selection: TableSelection;

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
     * Get the Table Cell in a provided coordinate
     * @param row row of the cell
     * @param col column of the cell
     */
    getTd(row: number, col: number): HTMLTableCellElement;

    /**
     * Transforms the selected cells to Ranges.
     * For Each Row a Range with selected cells, a Range is going to be returned.
     * @returns Array of ranges from the selected table cells.
     */
    getSelectedRanges(): Range[];

    /**
     * Highlights a range of cells, used in the TableSelection Plugin
     */
    highlight(): void;

    /**
     * Sets the range of selection and highlights the cells
     * @param selection The selection to apply to the table
     */
    highlightSelection(selection: TableSelection): void;

    /**
     * Highlights all the cells in the table.
     */
    highlightAll(): void;

    /**
     * Removes the selection of all the tables
     */
    deSelectAll(): void;

    /**
     * Executes an action to all the cells within the selection range.
     * @param callback action to apply on each selected cell
     * @returns the amount of cells modified
     */
    forEachSelectedCell(callback: (cell: VCell) => void): number;

    /**
     * Execute an action on all the cells
     * @param callback action to apply on all the cells.
     */
    forEachCell(callback: (cell: VCell, x?: number, y?: number) => void): void;

    /**
     * Remove the cells outside of the selection.
     * @param outsideOfSelection whether to remove the cells outside or inside of the selection
     */
    removeCellsBySelection(outsideOfSelection: boolean): void;

    /**
     * Gets the coordinates of a cell
     * @param cellInput The cell the to find the coordinates
     * @returns Coordinates of the cell, null if not found
     */
    getCellCoordinates(cellInput: Node): Coordinates;
}
