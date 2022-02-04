import changeElementTag from '../utils/changeElementTag';
import moveChildNodes from '../utils/moveChildNodes';
import normalizeRect from '../utils/normalizeRect';
import safeInstanceOf from '../utils/safeInstanceOf';
import toArray from '../utils/toArray';
import { getTableFormatInfo, saveTableInfo } from '../utils/tableFormatInfo';
import {
    SizeTransformer,
    TableBorderFormat,
    TableFormat,
    TableOperation,
    TableSelection,
    VCell,
} from 'roosterjs-editor-types';

const TRANSPARENT = 'transparent';
const TABLE_CELL_TAG_NAME = 'TD';
const TABLE_HEADER_TAG_NAME = 'TH';
const CELL_SHADE = 'cellShade';

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
     * Current format of the table
     */
    formatInfo: TableFormat;

    /**
     * Selected range of cells with the coordinates of the first and last cell selected.
     */
    selection: TableSelection;

    private trs: HTMLTableRowElement[] = [];

    /**
     * Create a new instance of VTable object using HTML TABLE or TD node
     * @param node The HTML Table or TD node
     * @param normalizeSize Whether table size needs to be normalized
     * @param sizeTransformer A size transformer function used for normalize table size
     */
    constructor(
        node: HTMLTableElement | HTMLTableCellElement,
        normalizeSize?: boolean,
        sizeTransformer?: SizeTransformer
    ) {
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
            this.formatInfo = getTableFormatInfo(this.table);
            if (normalizeSize) {
                this.normalizeSize(sizeTransformer);
            }
        }
    }

    /**
     * Write the virtual table back to DOM tree to represent the change of VTable
     * @param isResized if the table was resized, the shaded cell should not be colored
     */
    writeBack(isResized?: boolean) {
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
            if (this.formatInfo) {
                saveTableInfo(this.table, this.formatInfo);
                this.formatInfo = getTableFormatInfo(this.table);
                this.applyFormat(this.formatInfo, isResized);
            }
        } else if (this.table) {
            this.table.parentNode.removeChild(this.table);
        }
    }

    /**
     * Apply the given table format to this virtual table
     * @param format Table format to apply
     * @param isResized if the table was resized, the shaded cell should not be colored
     */
    applyFormat(format: Partial<TableFormat>, isResized?: boolean) {
        if (!this.table) {
            return;
        }

        this.formatInfo = format ? format : this.formatInfo;
        this.table.style.borderCollapse = 'collapse';
        this.setBordersType(this.formatInfo);
        this.setColor(this.formatInfo, isResized);
        this.setFirstColumnFormat(this.formatInfo);
        this.setHeaderRowFormat(this.formatInfo);
    }
    /**
     * Check if the cell has shade
     * @param cell
     * @returns
     */
    private hasCellShade(cell: VCell) {
        const colorShade = cell.td.dataset[CELL_SHADE];
        return colorShade ? true : false;
    }
    /**
     * Check if the cell must receive color
     * @param cell
     * @param isResized if the table was resized, the shaded cell should not be colored
     * @returns
     */
    private shouldApplyFormatToCell(cell: VCell, isResized?: boolean): boolean {
        return this.hasCellShade(cell) && isResized ? false : true;
    }

    /**
     * Set color to the table
     * @param format the format that must be applied
     * @param isResized if the table was resized, the shaded cell should not be colored
     */
    private setColor(format: TableFormat, isResized?: boolean) {
        const color = (index: number) => (index % 2 === 0 ? format.bgColorEven : format.bgColorOdd);
        const { hasBandedRows, hasBandedColumns, bgColorOdd, bgColorEven } = format;
        const shouldColorWholeTable = !hasBandedRows && bgColorOdd === bgColorEven ? true : false;
        this.cells.forEach((row, index) => {
            row.forEach(cell => {
                if (cell.td && this.shouldApplyFormatToCell(cell, isResized)) {
                    if (hasBandedRows) {
                        const backgroundColor = color(index);
                        cell.td.style.backgroundColor = backgroundColor;
                    } else if (shouldColorWholeTable) {
                        cell.td.style.backgroundColor = format.bgColorOdd;
                    } else {
                        cell.td.style.backgroundColor = null;
                    }
                    if (this.hasCellShade(cell)) {
                        delete cell.td.dataset[CELL_SHADE];
                    }
                }
            });
        });
        if (hasBandedColumns) {
            this.cells.forEach(row => {
                row.forEach((cell, index) => {
                    const backgroundColor = color(index);
                    if (
                        cell.td &&
                        backgroundColor &&
                        this.shouldApplyFormatToCell(cell, isResized)
                    ) {
                        cell.td.style.backgroundColor = backgroundColor;
                    }
                });
            });
        }
    }

    /**
     * Set color to borders of an table
     * @param format
     * @returns
     */
    private setBorderColors(td: HTMLTableCellElement, format: Partial<TableFormat>) {
        td.style.borderTop = getBorderStyle(format.topBorderColor);
        td.style.borderLeft = getBorderStyle(format.verticalBorderColor);
        td.style.borderRight = getBorderStyle(format.verticalBorderColor);
        td.style.borderBottom = getBorderStyle(format.bottomBorderColor);
    }

    /**
     * Format the border type
     * @returns
     */
    private formatBorders(
        format: TableFormat,
        td: HTMLTableCellElement,
        isFirstRow: boolean,
        isLastRow: boolean,
        isFirstColumn: boolean,
        isLastColumn: boolean
    ) {
        this.setBorderColors(td, format);
        switch (format.tableBorderFormat) {
            case TableBorderFormat.DEFAULT:
                return;
            case TableBorderFormat.LIST_WITH_SIDE_BORDERS:
                if (!isFirstColumn) {
                    td.style.borderLeftColor = TRANSPARENT;
                }
                if (!isLastColumn) {
                    td.style.borderRightColor = TRANSPARENT;
                }

                break;
            case TableBorderFormat.FIRST_COLUMN_HEADER_EXTERNAL:
                if (!isFirstRow) {
                    td.style.borderTopColor = TRANSPARENT;
                }

                if (!isLastRow && !isFirstRow) {
                    td.style.borderBottomColor = TRANSPARENT;
                }
                if (!isFirstColumn) {
                    td.style.borderLeftColor = TRANSPARENT;
                }
                if (!isLastColumn && !isFirstColumn) {
                    td.style.borderRightColor = TRANSPARENT;
                }
                if (isFirstColumn && isFirstRow) {
                    td.style.borderRightColor = TRANSPARENT;
                }

                break;
            case TableBorderFormat.NO_HEADER_BORDERS:
                if (isFirstRow) {
                    td.style.borderTopColor = TRANSPARENT;
                    td.style.borderRightColor = TRANSPARENT;
                    td.style.borderLeftColor = TRANSPARENT;
                }
                if (isFirstColumn) {
                    td.style.borderLeftColor = TRANSPARENT;
                }
                if (isLastColumn) {
                    td.style.borderRightColor = TRANSPARENT;
                }
                break;
            case TableBorderFormat.NO_SIDE_BORDERS:
                if (isFirstColumn) {
                    td.style.borderLeftColor = TRANSPARENT;
                }
                if (isLastColumn) {
                    td.style.borderRightColor = TRANSPARENT;
                }
                break;
            case TableBorderFormat.ESPECIAL_TYPE_1:
                if (isFirstRow) {
                    td.style.borderRightColor = TRANSPARENT;
                    td.style.borderLeftColor = TRANSPARENT;
                }
                if (isFirstColumn) {
                    td.style.borderBottomColor = TRANSPARENT;
                    td.style.borderTopColor = TRANSPARENT;
                }
                if (isFirstRow && isFirstColumn) {
                    td.style.borderLeftColor = format.verticalBorderColor;
                    td.style.borderBottomColor = format.bottomBorderColor;
                    td.style.borderTopColor = format.topBorderColor;
                }
                break;
            case TableBorderFormat.ESPECIAL_TYPE_2:
                if (isFirstRow) {
                    td.style.borderRightColor = TRANSPARENT;
                    td.style.borderLeftColor = TRANSPARENT;
                }
                if (isFirstColumn) {
                    td.style.borderBottomColor = TRANSPARENT;
                    td.style.borderTopColor = TRANSPARENT;
                }
                if (isFirstRow && isFirstColumn) {
                    td.style.borderLeftColor = format.verticalBorderColor;
                    td.style.borderBottomColor = format.bottomBorderColor;
                    td.style.borderTopColor = format.topBorderColor;
                }
                if (!isFirstRow && !isFirstColumn) {
                    td.style.borderLeftColor = TRANSPARENT;
                    td.style.borderBottomColor = TRANSPARENT;
                    td.style.borderTopColor = TRANSPARENT;
                    td.style.borderRightColor = TRANSPARENT;
                }

                break;
            case TableBorderFormat.ESPECIAL_TYPE_3:
                if (isFirstRow) {
                    td.style.borderLeftColor = TRANSPARENT;
                    td.style.borderTopColor = TRANSPARENT;
                    td.style.borderRightColor = TRANSPARENT;
                }
                if (isFirstColumn) {
                    td.style.borderLeftColor = TRANSPARENT;
                    td.style.borderTopColor = TRANSPARENT;
                    td.style.borderBottomColor = TRANSPARENT;
                }
                if (!isFirstRow && !isFirstColumn) {
                    td.style.borderLeftColor = TRANSPARENT;
                    td.style.borderBottomColor = TRANSPARENT;
                    td.style.borderTopColor = TRANSPARENT;
                    td.style.borderRightColor = TRANSPARENT;
                }
                if (isFirstRow && isFirstColumn) {
                    td.style.borderBottomColor = format.bottomBorderColor;
                }
                break;
        }
    }

    /**
     * Organize the borders of table according to a border type
     * @param format
     * @returns
     */

    private setBordersType(format: TableFormat) {
        this.cells.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell.td) {
                    this.formatBorders(
                        format,
                        cell.td,
                        rowIndex === 0,
                        rowIndex === this.cells.length - 1,
                        cellIndex === 0,
                        cellIndex === row.length - 1
                    );
                }
            });
        });
    }

    /**
     * Apply custom design to the first table column
     * @param format
     * @returns
     */
    private setFirstColumnFormat(format: Partial<TableFormat>) {
        if (!format.hasFirstColumn) {
            this.forEachCellOfColumn(0, (cell, row, i) => {
                if (cell.td) {
                    cell.td = changeElementTag(
                        cell.td,
                        TABLE_CELL_TAG_NAME
                    ) as HTMLTableCellElement;
                    cell.td.scope = '';
                }
            });
            return;
        }
        this.forEachCellOfColumn(0, (cell, row, i) => {
            if (cell.td) {
                if (i !== 0) {
                    cell.td.style.borderTopColor = TRANSPARENT;
                    cell.td.style.backgroundColor = TRANSPARENT;
                }
                if (i !== this.cells.length - 1 && i !== 0) {
                    cell.td.style.borderBottomColor = TRANSPARENT;
                }
                cell.td = changeElementTag(cell.td, TABLE_HEADER_TAG_NAME) as HTMLTableCellElement;
                cell.td.scope = 'col';
            }
        });
    }

    /**
     * Apply custom design to the Header Row
     * @param format
     * @returns
     */
    private setHeaderRowFormat(format: TableFormat) {
        if (!format.hasHeaderRow) {
            this.forEachCellOfRow(0, (cell, i) => {
                if (cell.td) {
                    cell.td = changeElementTag(
                        cell.td,
                        TABLE_CELL_TAG_NAME
                    ) as HTMLTableCellElement;
                    cell.td.scope = '';
                }
            });
            return;
        }
        this.forEachCellOfRow(0, (cell, i) => {
            if (cell.td) {
                cell.td.style.backgroundColor = format.headerRowColor;
                cell.td.style.borderRightColor = format.headerRowColor;
                cell.td.style.borderLeftColor = format.headerRowColor;
                cell.td.style.borderTopColor = format.headerRowColor;
                cell.td = changeElementTag(cell.td, TABLE_HEADER_TAG_NAME) as HTMLTableCellElement;
                cell.td.scope = 'row';
            }
        });
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

                    if (cellRect) {
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
     * Get the Table Cell in a provided coordinate
     * @param row row of the cell
     * @param col column of the cell
     */
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
        for (let i = 0; i < this.cells[row].length; i++) {
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
    public normalizeTableCellSize(sizeTransformer?: SizeTransformer) {
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
                    setHTMLElementSizeInPx(
                        cell.td,
                        sizeTransformer?.(cell.width) || cell.width,
                        sizeTransformer?.(cell.height) || cell.height
                    );
                }
            }
        }
    }

    private normalizeSize(sizeTransformer: SizeTransformer) {
        this.normalizeEmptyTableCells();
        this.normalizeTableCellSize(sizeTransformer);

        const rect = this.table.getBoundingClientRect();

        // Make sure table width/height is fixed to avoid shifting effect
        setHTMLElementSizeInPx(
            this.table,
            sizeTransformer?.(rect.width) || rect.width,
            sizeTransformer?.(rect.height) || rect.height
        );
    }
}

function setHTMLElementSizeInPx(element: HTMLElement, newWidth: number, newHeight: number) {
    if (!!element) {
        element.removeAttribute('width');
        element.removeAttribute('height');
        element.style.boxSizing = 'border-box';
        element.style.width = `${newWidth}px`;
        element.style.height = `${newHeight}px`;
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
