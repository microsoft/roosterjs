import moveChildNodes from '../utils/moveChildNodes';
import normalizeRect from '../utils/normalizeRect';
import queryElements from '../utils/queryElements';
import safeInstanceOf from '../utils/safeInstanceOf';
import setColor from '../utils/setColor';
import toArray from '../utils/toArray';
import { getHighlightColor, getOriginalColor } from '../utils/getTableOriginalColor';
import { ModeIndependentColor, TableFormat, TableOperation, VCell } from 'roosterjs-editor-types';
import { TableMetadata } from './tableMetadata';

const TABLE_CELL_SELECTED_CLASS = TableMetadata.TABLE_CELL_SELECTED;
const TEMP_BACKGROUND_COLOR = TableMetadata.TEMP_BACKGROUND_COLOR;

/**
 * A virtual table class, represent an HTML table, by expand all merged cells to each separated cells
 */
export default class VTable {
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

    private trs: HTMLTableRowElement[] = [];

    /**
     * Create a new instance of VTable object using HTML TABLE or TD node
     * @param node The HTML Table or TD node
     */
    constructor(node: HTMLTableElement | HTMLTableCellElement, normalizeSize?: boolean) {
        this.table = safeInstanceOf(node, 'HTMLTableElement') ? node : getTableFromTd(node);
        if (this.table) {
            let currentTd = safeInstanceOf(node, 'HTMLTableElement') ? null : node;
            let trs = toArray(this.table.rows);
            this.cells = trs.map(row => []);
            trs.forEach((tr, rowIndex) => {
                this.trs[rowIndex % 2] = tr;
                for (let sourceCol = 0, targetCol = 0; sourceCol < tr.cells.length; sourceCol++) {
                    // Skip the cells which already initialized
                    for (; this.cells[rowIndex][targetCol]; targetCol++) {}

                    let td = tr.cells[sourceCol];
                    if (td == currentTd) {
                        this.col = targetCol;
                        this.row = rowIndex;
                    }

                    for (let colSpan = 0; colSpan < td.colSpan; colSpan++, targetCol++) {
                        for (let rowSpan = 0; rowSpan < td.rowSpan; rowSpan++) {
                            const hasTd: boolean = colSpan + rowSpan == 0;
                            const rect = td.getBoundingClientRect();
                            this.cells[rowIndex + rowSpan][targetCol] = {
                                td: hasTd ? td : null,
                                spanLeft: colSpan > 0,
                                spanAbove: rowSpan > 0,
                                width: hasTd ? rect.width : undefined,
                                height: hasTd ? rect.height : undefined,
                            };
                        }
                    }
                }
            });

            if (normalizeSize) {
                this.normalizeSize();
            }
        }
    }

    /**
     * Write the virtual table back to DOM tree to represent the change of VTable
     */
    writeBack() {
        if (this.cells) {
            moveChildNodes(this.table);
            this.cells.forEach((row, r) => {
                let tr = cloneNode(this.trs[r % 2] || this.trs[0]);
                this.table.appendChild(tr);
                row.forEach((cell, c) => {
                    if (cell.td) {
                        this.recalculateSpans(r, c);
                        tr.appendChild(cell.td);
                    }
                });
            });
        } else if (this.table) {
            this.table.parentNode.removeChild(this.table);
        }
    }

    /**
     * Apply the given table format to this virtual table
     * @param format Table format to apply
     */
    applyFormat(format: Partial<TableFormat>) {
        if (!format || !this.table) {
            return;
        }
        this.table.style.borderCollapse = 'collapse';
        this.trs[0].style.backgroundColor = format.bgColorOdd || 'transparent';
        if (this.trs[1]) {
            this.trs[1].style.backgroundColor = format.bgColorEven || 'transparent';
        }
        this.cells.forEach(row =>
            row
                .filter(cell => cell.td)
                .forEach(cell => {
                    cell.td.style.borderTop = getBorderStyle(format.topBorderColor);
                    cell.td.style.borderBottom = getBorderStyle(format.bottomBorderColor);
                    cell.td.style.borderLeft = getBorderStyle(format.verticalBorderColor);
                    cell.td.style.borderRight = getBorderStyle(format.verticalBorderColor);
                })
        );
    }

    /**
     * Edit table with given operation.
     * @param operation Table operation
     */
    edit(operation: TableOperation) {
        if (!this.table) {
            return;
        }

        let currentRow = this.cells[this.row];
        let currentCell = currentRow[this.col];
        let { style } = currentCell.td;
        switch (operation) {
            case TableOperation.InsertAbove:
                this.cells.splice(this.row, 0, currentRow.map(cloneCell));
                break;
            case TableOperation.InsertBelow:
                let newRow = this.row + this.countSpanAbove(this.row, this.col);
                this.cells.splice(
                    newRow,
                    0,
                    this.cells[newRow - 1].map((cell, colIndex) => {
                        let nextCell = this.getCell(newRow, colIndex);
                        if (nextCell.spanAbove) {
                            return cloneCell(nextCell);
                        } else if (cell.spanLeft) {
                            let newCell = cloneCell(cell);
                            newCell.spanAbove = false;
                            return newCell;
                        } else {
                            return {
                                td: cloneNode(this.getTd(this.row, colIndex)),
                            };
                        }
                    })
                );
                break;

            case TableOperation.InsertLeft:
                this.forEachCellOfCurrentColumn((cell, row) => {
                    row.splice(this.col, 0, cloneCell(cell));
                });
                break;
            case TableOperation.InsertRight:
                let newCol = this.col + this.countSpanLeft(this.row, this.col);
                this.forEachCellOfColumn(newCol - 1, (cell, row, i) => {
                    let nextCell = this.getCell(i, newCol);
                    let newCell: VCell;
                    if (nextCell.spanLeft) {
                        newCell = cloneCell(nextCell);
                    } else if (cell.spanAbove) {
                        newCell = cloneCell(cell);
                        newCell.spanLeft = false;
                    } else {
                        newCell = {
                            td: cloneNode(this.getTd(i, this.col)),
                        };
                    }

                    row.splice(newCol, 0, newCell);
                });
                break;

            case TableOperation.DeleteRow:
                this.forEachCellOfCurrentRow((cell, i) => {
                    let nextCell = this.getCell(this.row + 1, i);
                    if (cell.td && cell.td.rowSpan > 1 && nextCell.spanAbove) {
                        nextCell.td = cell.td;
                    }
                });
                this.cells.splice(this.row, 1);
                break;

            case TableOperation.DeleteColumn:
                this.forEachCellOfCurrentColumn((cell, row, i) => {
                    let nextCell = this.getCell(i, this.col + 1);
                    if (cell.td && cell.td.colSpan > 1 && nextCell.spanLeft) {
                        nextCell.td = cell.td;
                    }
                    row.splice(this.col, 1);
                });
                break;

            case TableOperation.MergeAbove:
            case TableOperation.MergeBelow:
                let rowStep = operation == TableOperation.MergeAbove ? -1 : 1;
                for (
                    let rowIndex = this.row + rowStep;
                    rowIndex >= 0 && rowIndex < this.cells.length;
                    rowIndex += rowStep
                ) {
                    let cell = this.getCell(rowIndex, this.col);
                    if (cell.td && !cell.spanAbove) {
                        let aboveCell = rowIndex < this.row ? cell : currentCell;
                        let belowCell = rowIndex < this.row ? currentCell : cell;
                        if (aboveCell.td.colSpan == belowCell.td.colSpan) {
                            moveChildNodes(
                                aboveCell.td,
                                belowCell.td,
                                true /*keepExistingChildren*/
                            );
                            belowCell.td = null;
                            belowCell.spanAbove = true;
                        }
                        break;
                    }
                }
                break;

            case TableOperation.MergeLeft:
            case TableOperation.MergeRight:
                let colStep = operation == TableOperation.MergeLeft ? -1 : 1;
                for (
                    let colIndex = this.col + colStep;
                    colIndex >= 0 && colIndex < this.cells[this.row].length;
                    colIndex += colStep
                ) {
                    let cell = this.getCell(this.row, colIndex);
                    if (cell.td && !cell.spanLeft) {
                        let leftCell = colIndex < this.col ? cell : currentCell;
                        let rightCell = colIndex < this.col ? currentCell : cell;
                        if (leftCell.td.rowSpan == rightCell.td.rowSpan) {
                            moveChildNodes(
                                leftCell.td,
                                rightCell.td,
                                true /*keepExistingChildren*/
                            );
                            rightCell.td = null;
                            rightCell.spanLeft = true;
                        }
                        break;
                    }
                }
                break;

            case TableOperation.DeleteTable:
                this.cells = null;
                break;

            case TableOperation.SplitVertically:
                if (currentCell.td.rowSpan > 1) {
                    this.getCell(this.row + 1, this.col).td = cloneNode(currentCell.td);
                } else {
                    let splitRow = currentRow.map(cell => {
                        return {
                            td: cell == currentCell ? cloneNode(cell.td) : null,
                            spanAbove: cell != currentCell,
                            spanLeft: cell.spanLeft,
                        };
                    });
                    this.cells.splice(this.row + 1, 0, splitRow);
                }
                break;

            case TableOperation.SplitHorizontally:
                if (currentCell.td.colSpan > 1) {
                    this.getCell(this.row, this.col + 1).td = cloneNode(currentCell.td);
                } else {
                    this.forEachCellOfCurrentColumn((cell, row) => {
                        row.splice(this.col + 1, 0, {
                            td: row == currentRow ? cloneNode(cell.td) : null,
                            spanAbove: cell.spanAbove,
                            spanLeft: row != currentRow,
                        });
                    });
                }
                break;

            case TableOperation.AlignCenter:
                this.table.style.marginLeft = 'auto';
                this.table.style.marginRight = 'auto';
                break;
            case TableOperation.AlignLeft:
                this.table.style.marginLeft = '';
                this.table.style.marginRight = 'auto';
                break;
            case TableOperation.AlignRight:
                this.table.style.marginLeft = 'auto';
                this.table.style.marginRight = '';
                break;
            case TableOperation.AlignCellCenter:
                style.textAlign = 'center';
                break;
            case TableOperation.AlignCellLeft:
                style.textAlign = 'left';
                break;
            case TableOperation.AlignCellRight:
                style.textAlign = 'right';
                break;
            case TableOperation.AlignCellTop:
                style.verticalAlign = 'top';
                break;
            case TableOperation.AlignCellMiddle:
                style.verticalAlign = 'middle';
                break;
            case TableOperation.AlignCellBottom:
                style.verticalAlign = 'bottom';
                break;
        }
    }

    /**
     * Loop each cell of current column and invoke a callback function
     * @param callback The callback function to invoke
     */
    forEachCellOfCurrentColumn(callback: (cell: VCell, row: VCell[], i: number) => any) {
        this.forEachCellOfColumn(this.col, callback);
    }

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
    getCellsWithBorder(borderPos: number, getLeftCells: boolean): HTMLTableCellElement[] {
        const cells: HTMLTableCellElement[] = [];
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                const cell = this.getCell(i, j);
                if (cell.td) {
                    const cellRect = normalizeRect(cell.td.getBoundingClientRect());
                    let found: boolean = false;
                    if (getLeftCells) {
                        if (cellRect.right == borderPos) {
                            found = true;
                            cells.push(cell.td);
                        } else if (found) {
                            break;
                        }
                    } else {
                        if (cellRect.left == borderPos) {
                            found = true;
                            cells.push(cell.td);
                        } else if (found) {
                            break;
                        }
                    }
                }
            }
        }
        return cells;
    }

    /**
     * Loop each cell of current row and invoke a callback function
     * @param callback The callback function to invoke
     */
    forEachCellOfCurrentRow(callback: (cell: VCell, i: number) => any) {
        this.forEachCellOfRow(this.row, callback);
    }

    /**
     * Get a table cell using its row and column index. This function will always return an object
     * even if the given indexes don't exist in table.
     * @param row The row index
     * @param col The column index
     */
    getCell(row: number, col: number): VCell {
        return (this.cells && this.cells[row] && this.cells[row][col]) || {};
    }

    /**
     * Get current HTML table cell object. If the current table cell is a virtual expanded cell, return its root cell
     */
    getCurrentTd(): HTMLTableCellElement {
        return this.getTd(this.row, this.col);
    }

    /**
     * Highlights a range of cells, used in the TableSelection Plugin
     */
    highlight() {
        this.normalizeSelectionRange();

        if (this.startRange && this.endRange && this.cells && this.table) {
            if (!this.table.classList.contains(TableMetadata.TABLE_SELECTED)) {
                this.table.classList.add(TableMetadata.TABLE_SELECTED);
            }
            let startX: number = this.startRange[0];
            let startY: number = this.startRange[1];
            let endX: number = this.endRange[0];
            let endY: number = this.endRange[1];

            let colIndex = this.cells[this.cells.length - 1].length - 1;
            const selectedAllTable =
                (startX == 0 && startY == 0 && endX == colIndex && endY == this.cells.length - 1) ||
                (endX == 0 && endY == 0 && startX == colIndex && startY == this.cells.length - 1);

            for (let indexY = 0; indexY < this.cells.length; indexY++) {
                for (let indexX = 0; indexX < this.cells[indexY].length; indexX++) {
                    let element = this.getMergedCell(indexX, indexY);
                    if (element) {
                        if (
                            selectedAllTable ||
                            (((indexY >= startY && indexY <= endY) ||
                                (indexY <= startY && indexY >= endY)) &&
                                ((indexX >= startX && indexX <= endX) ||
                                    (indexX <= startX && indexX >= endX)))
                        ) {
                            this.highlightCellHandler(element);
                        } else {
                            this.deselectCellHandler(element);
                        }
                    }
                }
            }
        }
    }

    /**
     * Modified the selection range to take into account the col and row spans
     */
    normalizeSelectionRange() {
        if (this.cells) {
            const handler = (input: number[]) => {
                let tempRange: number[];
                tempRange = input;
                this.forEachCellOfRow(tempRange[1], (cell, i) => {
                    if (i > tempRange[0]) {
                        if (cell.spanLeft && i == input[0] + 1) {
                            input[0] += 1;
                        }
                    }
                });
                tempRange = input;
                this.forEachCellOfColumn(tempRange[0], (cell, row, i) => {
                    if (i > tempRange[1]) {
                        if (cell.spanAbove && i == input[1] + 1) {
                            input[1] += 1;
                        }
                    }
                });
            };

            if (this.startRange[0] >= this.endRange[0] && this.startRange[1] >= this.endRange[1]) {
                handler(this.startRange);
            } else {
                handler(this.endRange);
            }
        }
    }

    private getMergedCell(x: number, y: number, setAsStart?: boolean) {
        let element = this.cells[y][x].td as HTMLElement;
        if (this.cells[y][x].spanLeft) {
            for (let cellX = x; cellX > 0; cellX--) {
                const cell = this.cells[y][cellX];
                if (cell.spanAbove) {
                    element = null;
                    break;
                }
                if (cell.td) {
                    element = cell.td;
                    x = cellX;
                    break;
                }
            }
        }
        if (setAsStart != null) {
            if (setAsStart) {
                this.startRange = [x, this.startRange[0]];
            } else {
                this.endRange = [x, this.endRange[0]];
            }
        }

        return element;
    }
    /**
     * Sets the range of selection and highlights
     * @param start represents the start of the range type of array [x, y]
     * @param end  represents the end of the range type of array [x, y]
     */
    highlightSelection(start: number[], end: number[]) {
        this.startRange = start;
        this.endRange = end;

        this.highlight();
    }

    /**
     * Highlights all the cells in the table.
     */
    highlightAll() {
        this.startRange = null;
        this.endRange = null;
        this.forEachCell((cell, x, y) => {
            if (cell.td) {
                this.highlightCellHandler(cell.td);
                const currentIndex: number[] = [x, y];
                this.startRange = this.startRange || currentIndex;
                this.endRange = currentIndex;
            }
        });
    }

    /**
     * Removes the selection of all the tables
     * @param cacheSelection wether we need to cache the selection
     */
    deSelectAll(cacheSelection: boolean = false) {
        this.forEachCell(cell => {
            if (cell.td) {
                this.deselectCellHandler(cell.td, cacheSelection);
            }
        });
        if (this.table?.classList.contains(TableMetadata.TABLE_SELECTED)) {
            this.table.classList.remove(TableMetadata.TABLE_SELECTED);
        }
    }

    /**
     * Handler to apply te selected styles on the cell
     * @param element element to apply the style
     */
    private highlightCellHandler = (element: HTMLElement) => {
        const highlighColor = getHighlightColor();
        if (
            !element.classList.contains(TABLE_CELL_SELECTED_CLASS) &&
            element.style.backgroundColor != highlighColor &&
            (!element.dataset[TEMP_BACKGROUND_COLOR] ||
                element.dataset[TEMP_BACKGROUND_COLOR] == '')
        ) {
            element.dataset[TEMP_BACKGROUND_COLOR] = getOriginalColor(
                element.style.backgroundColor ?? element.style.background
            );
        }
        element.style.backgroundColor = highlighColor;
        element.classList.add(TABLE_CELL_SELECTED_CLASS);

        element.querySelectorAll('table').forEach(table => {
            const vTable = new VTable(table);
            vTable.forEachCell(cell => vTable.highlightCellHandler(cell.td));
        });
    };

    /**
     * Handler to remove the selected style
     * @param cell element to apply the style
     * @param cacheSelection wether we need to cache the selection
     * @returns
     */
    private deselectCellHandler = (cell: HTMLElement, cacheSelection: boolean = false) => {
        if (cell.dataset[TableMetadata.ON_FOCUS_CACHE] == 'onBlur') {
            delete cell.dataset[TableMetadata.ON_FOCUS_CACHE];
            return;
        }
        if (
            cell &&
            safeInstanceOf(cell, 'HTMLTableCellElement') &&
            cell.classList.contains(TABLE_CELL_SELECTED_CLASS)
        ) {
            cell.classList.remove(TABLE_CELL_SELECTED_CLASS);
            cell.style.backgroundColor = getOriginalColor(cell.dataset[TEMP_BACKGROUND_COLOR]);
            delete cell.dataset[TEMP_BACKGROUND_COLOR];
            cell.querySelectorAll('table').forEach(table => {
                const vTable = new VTable(table);
                vTable.forEachCell(cell => vTable.deselectCellHandler(cell.td, cacheSelection));
            });

            if (cacheSelection) {
                cell.classList.add(TABLE_CELL_SELECTED_CLASS);
                cell.dataset[TableMetadata.ON_FOCUS_CACHE] = 'onBlur';

                cell.dataset[TEMP_BACKGROUND_COLOR] = getOriginalColor(
                    cell.style.backgroundColor ?? cell.style.background
                );
            }
        }
    };

    /**
     * Check if the cell is inside of the selection range
     * @returns true if it is inside, otherwise false
     */
    private isInsideOfSelection(x: number, y: number) {
        if (this.startRange && this.endRange) {
            let startX: number = this.startRange[0];
            let startY: number = this.startRange[1];
            let endX: number = this.endRange[0];
            let endY: number = this.endRange[1];

            return (
                ((y >= startY && y <= endY) || (y <= startY && y >= endY)) &&
                ((x >= startX && x <= endX) || (x <= startX && x >= endX))
            );
        }
        return false;
    }

    /**
     * Executes an action to all the cells within the selection range.
     * @param callback action to apply on each selected cell
     * @returns the amount of cells modified
     */
    forEachSelectedCell(callback: (cell: VCell) => void): number {
        let selectedCells = 0;

        for (let indexY = 0; indexY < this.cells.length; indexY++) {
            for (let indexX = 0; indexX < this.cells[indexY].length; indexX++) {
                let element = this.cells[indexY][indexX].td as HTMLElement;
                if (
                    element?.classList.contains(TABLE_CELL_SELECTED_CLASS) ||
                    this.isInsideOfSelection(indexX, indexY)
                ) {
                    selectedCells += 1;
                    callback(this.cells[indexY][indexX]);
                }
            }
        }

        return selectedCells;
    }

    /**
     * Execute an action on all the cells
     * @param callback action to apply on all the cells.
     */
    forEachCell(callback: (cell: VCell, x?: number, y?: number) => void) {
        for (let indexY = 0; indexY < this.cells.length; indexY++) {
            for (let indexX = 0; indexX < this.cells[indexY].length; indexX++) {
                callback(this.cells[indexY][indexX], indexX, indexY);
            }
        }
    }

    /**
     * Remove the cells outside of the selection.
     */
    removeCellsOutsideOfSelection() {
        const tempCells: VCell[][] = [];

        let startX: number = this.startRange[0];
        let startY: number = this.startRange[1];
        let endX: number = this.endRange[0];
        let endY: number = this.endRange[1];

        let colIndex = this.cells[this.cells.length - 1].length - 1;
        const selectedAllTable =
            (startX == 0 && startY == 0 && endX == colIndex && endY == this.cells.length - 1) ||
            (endX == 0 && endY == 0 && startX == colIndex && startY == this.cells.length - 1);

        if (selectedAllTable) {
            return;
        }

        this.forEachCell((cell: VCell, x?: number, y?: number) => {
            if (this.isInsideOfSelection(x, y)) {
                while (tempCells.length - 1 < y) {
                    tempCells.push([]);
                }
                tempCells[y].push(cell);
            }
        });
        this.cells = tempCells.filter(cell => cell.length > 0);
    }

    /**
     * Gets the coordinates of a cell
     * @param cellInput The cell the function is going to retrieve the coordinate
     * @returns an array[2] => [x,y]
     */
    getCellCoordinates(cellInput: Node) {
        let result: number[] = [];
        if (this.cells) {
            for (let indexY = 0; indexY < this.cells.length; indexY++) {
                for (let indexX = 0; indexX < this.cells[indexY].length; indexX++) {
                    if (cellInput == this.cells[indexY][indexX].td) {
                        result = [indexX, indexY];
                    }
                }
            }
        }

        return result;
    }

    getTd(row: number, col: number) {
        if (this.cells) {
            row = Math.min(this.cells.length - 1, row);
            col = this.cells[row] ? Math.min(this.cells[row].length - 1, col) : col;
            if (!isNaN(row) && !isNaN(col)) {
                while (row >= 0 && col >= 0) {
                    let cell = this.getCell(row, col);
                    if (cell.td) {
                        return cell.td;
                    } else if (cell.spanLeft) {
                        col--;
                    } else if (cell.spanAbove) {
                        row--;
                    } else {
                        break;
                    }
                }
            }
        }
        return null;
    }

    private forEachCellOfColumn(
        col: number,
        callback: (cell: VCell, row: VCell[], i: number) => any
    ) {
        for (let i = 0; i < this.cells.length; i++) {
            callback(this.getCell(i, col), this.cells[i], i);
        }
    }

    private forEachCellOfRow(row: number, callback: (cell: VCell, i: number) => any) {
        for (let i = 0; i < this.cells[row]?.length; i++) {
            callback(this.getCell(row, i), i);
        }
    }

    private recalculateSpans(row: number, col: number) {
        let td = this.getCell(row, col).td;
        if (td) {
            td.colSpan = this.countSpanLeft(row, col);
            td.rowSpan = this.countSpanAbove(row, col);
            if (td.colSpan == 1) {
                td.removeAttribute('colSpan');
            }
            if (td.rowSpan == 1) {
                td.removeAttribute('rowSpan');
            }
        }
    }

    private countSpanLeft(row: number, col: number) {
        let result = 1;
        for (let i = col + 1; i < this.cells[row].length; i++) {
            let cell = this.getCell(row, i);
            if (cell.td || !cell.spanLeft) {
                break;
            }
            result++;
        }
        return result;
    }

    private countSpanAbove(row: number, col: number) {
        let result = 1;
        for (let i = row + 1; i < this.cells.length; i++) {
            let cell = this.getCell(i, col);
            if (cell.td || !cell.spanAbove) {
                break;
            }
            result++;
        }
        return result;
    }

    private normalizeEmptyTableCells() {
        for (let i = 0, row; (row = this.table.rows[i]); i++) {
            for (let j = 0, cell; (cell = row.cells[j]); j++) {
                if (cell) {
                    if (!cell.innerHTML || !cell.innerHTML.trim()) {
                        cell.appendChild(document.createElement('br'));
                    }
                }
            }
        }
    }

    /* normalize width/height for each cell in the table */
    public normalizeTableCellSize() {
        // remove width/height for each row
        for (let i = 0, row; (row = this.table.rows[i]); i++) {
            row.removeAttribute('width');
            row.style.width = null;
            row.removeAttribute('height');
            row.style.height = null;
        }

        // set width/height for each cell
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                const cell = this.cells[i][j];
                if (cell) {
                    setHTMLElementSizeInPx(cell.td, cell.width, cell.height);
                }
            }
        }
    }

    private normalizeSize() {
        this.normalizeEmptyTableCells();
        this.normalizeTableCellSize();
        setHTMLElementSizeInPx(this.table); // Make sure table width/height is fixed to avoid shifting effect
    }

    setBackgroundColor(backgroundColor: string | ModeIndependentColor, isInDarkMode: boolean) {
        if (!this.table) {
            return;
        }

        const handler = (td: HTMLTableCellElement) => {
            if (td) {
                setColor(td, backgroundColor, true, isInDarkMode);

                const colorString =
                    typeof backgroundColor === 'string' ? backgroundColor.trim() : '';
                const modeIndependentColor =
                    typeof backgroundColor === 'string' ? null : backgroundColor;

                td.dataset[TEMP_BACKGROUND_COLOR] =
                    (isInDarkMode
                        ? modeIndependentColor?.darkModeColor
                        : modeIndependentColor?.lightModeColor) || colorString;

                queryElements(td, 'td,th', handler);
            }
        };

        const modifiedCells = this.forEachSelectedCell(cell => handler(cell.td));

        if (modifiedCells == 0) {
            let currentRow = this.cells[this.row];
            let currentCell = currentRow[this.col];

            handler(currentCell.td);
        }
    }
}

function setHTMLElementSizeInPx(element: HTMLElement, newWidth?: number, newHeight?: number) {
    if (!!element) {
        element.removeAttribute('width');
        element.removeAttribute('height');
        element.style.boxSizing = 'border-box';
        const rect = element.getBoundingClientRect();
        element.style.width = `${newWidth !== undefined ? newWidth : rect.width}px`;
        element.style.height = `${newHeight !== undefined ? newHeight : rect.height}px`;
    }
}

function getTableFromTd(td: HTMLTableCellElement) {
    let result = <HTMLElement>td;
    for (; result && result.tagName != 'TABLE'; result = result.parentElement) {}
    return <HTMLTableElement>result;
}

function getBorderStyle(style: string): string {
    return 'solid 1px ' + (style || 'transparent');
}

/**
 * Clone a table cell
 * @param cell The cell to clone
 */
function cloneCell(cell: VCell): VCell {
    return {
        td: cloneNode(cell.td),
        spanAbove: cell.spanAbove,
        spanLeft: cell.spanLeft,
    };
}

/**
 * Clone a node without its children.
 * @param node The node to clone
 */
function cloneNode<T extends Node>(node: T): T {
    let newNode = node ? <T>node.cloneNode(false /*deep*/) : null;
    if (safeInstanceOf(newNode, 'HTMLTableCellElement')) {
        newNode.removeAttribute('id');
        if (!newNode.firstChild) {
            newNode.appendChild(node.ownerDocument.createElement('br'));
        }
    }
    return newNode;
}
