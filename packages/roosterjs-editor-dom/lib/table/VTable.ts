import applyTableFormat from './applyTableFormat';
import getTagOfNode from '../utils/getTagOfNode';
import moveChildNodes from '../utils/moveChildNodes';
import normalizeRect from '../utils/normalizeRect';
import safeInstanceOf from '../utils/safeInstanceOf';
import toArray from '../jsUtils/toArray';
import { getTableFormatInfo, saveTableInfo } from './tableFormatInfo';
import { removeMetadata } from '../metadata/metadata';
import {
    SizeTransformer,
    TableBorderFormat,
    TableFormat,
    TableOperation,
    TableSelection,
    VCell,
    DarkColorHandler,
} from 'roosterjs-editor-types';
import type { CompatibleTableOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

const DEFAULT_FORMAT: Required<TableFormat> = {
    topBorderColor: '#ABABAB',
    bottomBorderColor: '#ABABAB',
    verticalBorderColor: '#ABABAB',
    hasHeaderRow: false,
    hasFirstColumn: false,
    hasBandedRows: false,
    hasBandedColumns: false,
    bgColorEven: null,
    bgColorOdd: '#ABABAB20',
    headerRowColor: '#ABABAB',
    tableBorderFormat: TableBorderFormat.DEFAULT,
    keepCellShade: false,
};

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
    cells: VCell[][] | null = null;

    /**
     * Current row index
     */
    row: number | undefined;

    /**
     * Current column index
     */
    col: number | undefined;

    /**
     * Current format of the table
     */
    formatInfo: Required<TableFormat> | null = null;

    private trs: HTMLTableRowElement[] = [];

    private tableSelection: TableSelection | null = null;

    /**
     * Create a new instance of VTable object using HTML TABLE or TD node
     * @param node The HTML Table or TD node
     * @param normalizeSize Whether table size needs to be normalized
     * @param zoomScale When the table is under a zoomed container, pass in the zoom scale here
     */
    constructor(
        node: HTMLTableElement | HTMLTableCellElement,
        normalizeSize?: boolean,
        zoomScale?: number | SizeTransformer
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
                    for (; this.cells![rowIndex][targetCol]; targetCol++) {}
                    let td = tr.cells[sourceCol];

                    if (td == currentTd) {
                        this.col = targetCol;
                        this.row = rowIndex;
                    }

                    for (let colSpan = 0; colSpan < td.colSpan; colSpan++, targetCol++) {
                        for (let rowSpan = 0; rowSpan < td.rowSpan; rowSpan++) {
                            const hasTd: boolean = colSpan + rowSpan == 0;
                            const rect = td.getBoundingClientRect();
                            if (this.cells?.[rowIndex + rowSpan]) {
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
                }
            });
            this.formatInfo = getTableFormatInfo(this.table);
            if (normalizeSize) {
                this.normalizeSize(typeof zoomScale == 'number' ? n => n / zoomScale : zoomScale);
            }
        }
    }

    /**
     * Selected range of cells with the coordinates of the first and last cell selected.
     */
    public get selection(): TableSelection | null {
        return this.tableSelection || null;
    }

    public set selection(value: TableSelection | null) {
        if (value) {
            const { firstCell } = value;
            this.row = firstCell?.y;
            this.col = firstCell?.x;
        }
        this.tableSelection = value;
    }

    /**
     * Write the virtual table back to DOM tree to represent the change of VTable
     * @param skipApplyFormat Do not reapply table format when write back. Only use this parameter when you are pretty sure there is no format or table structure change during the process.
     * @param darkColorHandler An object to handle dark background colors, if not passed the cell background color will not be set
     */
    writeBack(skipApplyFormat?: boolean, darkColorHandler?: DarkColorHandler | null) {
        if (this.cells) {
            moveChildNodes(this.table);
            this.cells.forEach((row, r) => {
                let tr = cloneNode(this.trs[r % 2] || this.trs[0]);

                if (tr) {
                    this.table.appendChild(tr);
                    row.forEach((cell, c) => {
                        if (cell.td) {
                            this.recalculateSpans(r, c);
                            this.recalculateCellHeight(cell.td);
                            tr!.appendChild(cell.td);
                        }
                    });
                }
            });
            if (this.formatInfo && !skipApplyFormat) {
                saveTableInfo(this.table, this.formatInfo);
                applyTableFormat(this.table, this.cells, this.formatInfo, darkColorHandler);
            }
        } else if (this.table) {
            this.table.parentNode?.removeChild(this.table);
        }
    }

    private recalculateCellHeight(td: HTMLTableCellElement) {
        if (this.isEmptyCell(td) && td.rowSpan > 1) {
            for (let i = 1; i < td.rowSpan; i++) {
                const br = document.createElement('br');
                td.appendChild(br);
            }
        }
    }

    /**
     * Apply the given table format to this virtual table
     * @param format Table format to apply
     */
    applyFormat(format: Partial<TableFormat>) {
        if (!this.table) {
            return;
        }
        this.formatInfo = {
            ...DEFAULT_FORMAT,
            ...(this.formatInfo || {}),
            ...(format || {}),
        };
        if (!this.formatInfo.keepCellShade) {
            this.deleteCellShadeDataset(this.cells);
        }
    }

    /**
     * Remove the cellShade dataset to apply a new style format at the cell.
     * @param cells
     */
    private deleteCellShadeDataset(cells: VCell[][] | null) {
        cells?.forEach(row => {
            row.forEach(cell => {
                if (cell.td) {
                    removeMetadata(cell.td);
                }
            });
        });
    }

    /**
     * Edit table with given operation.
     * @param operation Table operation
     */
    edit(operation: TableOperation | CompatibleTableOperation) {
        if (!this.table || !this.cells || this.row === undefined || this.col == undefined) {
            return;
        }

        let currentRow = this.cells[this.row];
        let currentCell = currentRow[this.col];
        const firstRow = this.selection ? this.selection.firstCell.y : this.row;
        const lastRow = this.selection ? this.selection.lastCell.y : this.row;
        const firstColumn = this.selection ? this.selection.firstCell.x : this.col;
        const lastColumn = this.selection ? this.selection.lastCell.x : this.col;
        switch (operation) {
            case TableOperation.InsertAbove:
                for (let i = firstRow; i <= lastRow; i++) {
                    this.cells.splice(firstRow, 0, currentRow.map(cloneCell));
                }
                break;
            case TableOperation.InsertBelow:
                for (let i = firstRow; i <= lastRow; i++) {
                    let newRow = lastRow + this.countSpanAbove(lastRow, this.col);
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
                                    td: cloneNode(this.getTd(this.row!, colIndex)),
                                };
                            }
                        })
                    );
                }

                break;

            case TableOperation.InsertLeft:
                for (let i = firstColumn; i <= lastColumn; i++) {
                    this.forEachCellOfCurrentColumn((cell, row) => {
                        row.splice(i, 0, cloneCell(cell));
                    });
                }

                break;
            case TableOperation.InsertRight:
                for (let i = firstColumn; i <= lastColumn; i++) {
                    let newCol = lastColumn + this.countSpanLeft(this.row, lastColumn);
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
                                td: cloneNode(this.getTd(i, this.col!)),
                            };
                        }

                        row.splice(newCol, 0, newCell);
                    });
                }

                break;

            case TableOperation.DeleteRow:
                for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
                    this.forEachCellOfRow(rowIndex, (cell: VCell, i: number) => {
                        let nextCell = this.getCell(rowIndex + 1, i);
                        if (cell.td && cell.td.rowSpan > 1 && nextCell.spanAbove) {
                            nextCell.td = cell.td;
                        }
                    });
                }
                const removedRows = this.selection
                    ? this.selection.lastCell.y - this.selection.firstCell.y
                    : 0;
                this.cells.splice(firstRow, removedRows + 1);
                if (this.cells.length === 0) {
                    this.cells = null;
                }

                break;
            case TableOperation.DeleteColumn:
                let deletedColumns = 0;
                for (let colIndex = firstColumn; colIndex <= lastColumn; colIndex++) {
                    this.forEachCellOfColumn(colIndex, (cell, row, i) => {
                        let nextCell = this.getCell(i, colIndex + 1);
                        if (cell.td && cell.td.colSpan > 1 && nextCell.spanLeft) {
                            nextCell.td = cell.td;
                        }
                        const removedColumns = this.selection
                            ? colIndex - deletedColumns
                            : this.col!;
                        row.splice(removedColumns, 1);
                    });
                    deletedColumns++;
                }
                if (this.cells?.length === 0 || this.cells?.every(row => row.length === 0)) {
                    this.cells = null;
                }
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
                        this.mergeCells(aboveCell, belowCell);
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
                        this.mergeCells(leftCell, rightCell, true /** horizontally */);
                        break;
                    }
                }
                break;

            case TableOperation.MergeCells:
                for (let colIndex = firstColumn; colIndex <= lastColumn; colIndex++) {
                    for (let rowIndex = firstRow + 1; rowIndex <= lastRow; rowIndex++) {
                        let cell = this.getCell(firstRow, colIndex);
                        let nextCellBelow = this.getCell(rowIndex, colIndex);
                        this.mergeCells(cell, nextCellBelow);
                    }
                }
                for (let colIndex = firstColumn + 1; colIndex <= lastColumn; colIndex++) {
                    let cell = this.getCell(firstRow, firstColumn);
                    let nextCellRight = this.getCell(firstRow, colIndex);
                    this.mergeCells(cell, nextCellRight, true /** horizontally */);
                }

                break;
            case TableOperation.DeleteTable:
                this.cells = null;
                break;

            case TableOperation.SplitVertically:
                if (currentCell.td && currentCell.td.rowSpan > 1) {
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
                if (currentCell.td && currentCell.td.colSpan > 1) {
                    this.getCell(this.row, this.col + 1).td = cloneNode(currentCell.td);
                } else {
                    this.forEachCellOfCurrentColumn((cell, row) => {
                        row.splice(this.col! + 1, 0, {
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
                this.setAlignmentToSelectedCells(
                    firstRow,
                    lastRow,
                    firstColumn,
                    lastColumn,
                    'center'
                );
                break;
            case TableOperation.AlignCellLeft:
                this.setAlignmentToSelectedCells(
                    firstRow,
                    lastRow,
                    firstColumn,
                    lastColumn,
                    'left'
                );
                break;
            case TableOperation.AlignCellRight:
                this.setAlignmentToSelectedCells(
                    firstRow,
                    lastRow,
                    firstColumn,
                    lastColumn,
                    'right'
                );
                break;
            case TableOperation.AlignCellTop:
                this.setAlignmentToSelectedCells(
                    firstRow,
                    lastRow,
                    firstColumn,
                    lastColumn,
                    'top',
                    true /** isVertical */
                );
                break;
            case TableOperation.AlignCellMiddle:
                this.setAlignmentToSelectedCells(
                    firstRow,
                    lastRow,
                    firstColumn,
                    lastColumn,
                    'middle',
                    true /** isVertical */
                );
                break;
            case TableOperation.AlignCellBottom:
                this.setAlignmentToSelectedCells(
                    firstRow,
                    lastRow,
                    firstColumn,
                    lastColumn,
                    'bottom',
                    true /** isVertical */
                );
                break;
        }
    }

    setAlignmentToSelectedCells(
        firstRow: number,
        lastRow: number,
        firstColumn: number,
        lastColumn: number,
        alignmentType: string,
        isVertical?: boolean
    ) {
        for (let i = firstRow; i <= lastRow; i++) {
            for (let j = firstColumn; j <= lastColumn; j++) {
                if (this.cells) {
                    const cell = this.cells[i][j].td;
                    if (isVertical && cell) {
                        cell.style?.setProperty('vertical-align', alignmentType);
                    } else if (cell) {
                        cell.style?.setProperty('text-align', alignmentType);
                    }
                }
            }
        }
    }

    private mergeCells(cell: VCell, nextCell: VCell, horizontally?: boolean) {
        const checkSpans = horizontally
            ? cell.td?.rowSpan === nextCell.td?.rowSpan && !cell.spanLeft
            : cell.td?.colSpan === nextCell.td?.colSpan && !cell.spanAbove;
        if (cell.td && nextCell.td && checkSpans) {
            this.mergeCellContents(cell.td, nextCell.td);
            nextCell.td = null;
            if (horizontally) {
                nextCell.spanLeft = true;
            } else {
                nextCell.spanAbove = true;
            }
        }
    }

    private isEmptyCell(td: HTMLTableCellElement) {
        return td.childElementCount === 1 && getTagOfNode(td.firstChild) === 'BR';
    }

    private mergeCellContents(cellTd: HTMLTableCellElement, nextCellTd: HTMLTableCellElement) {
        if (this.isEmptyCell(nextCellTd)) {
            moveChildNodes(cellTd, nextCellTd, false /*keepExistingChildren*/);
        } else {
            const br = document.createElement('br');
            cellTd.appendChild(br);
            moveChildNodes(cellTd, nextCellTd, true /*keepExistingChildren*/);
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
        for (let i = 0; this.cells && i < this.cells.length; i++) {
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
    getCurrentTd(): HTMLTableCellElement | null {
        return this.getTd(this.row, this.col);
    }

    /**
     * Get the Table Cell in a provided coordinate
     * @param row row of the cell
     * @param col column of the cell
     */
    getTd(row: number | undefined, col: number | undefined) {
        if (this.cells && row !== undefined && col !== undefined) {
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
        col: number | undefined,
        callback: (cell: VCell, row: VCell[], i: number) => any
    ) {
        if (col !== undefined) {
            for (let i = 0; this.cells && i < this.cells.length; i++) {
                callback(this.getCell(i, col), this.cells[i], i);
            }
        }
    }

    private forEachCellOfRow(row: number | undefined, callback: (cell: VCell, i: number) => any) {
        if (row !== undefined) {
            for (let i = 0; this.cells && i < this.cells[row].length; i++) {
                callback(this.getCell(row, i), i);
            }
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
        for (let i = col + 1; this.cells && i < this.cells[row].length; i++) {
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
        for (let i = row + 1; this.cells && i < this.cells.length; i++) {
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
    public normalizeTableCellSize(zoomScale?: number | SizeTransformer) {
        // remove width/height for each row
        for (let i = 0, row; (row = this.table.rows[i]); i++) {
            row.removeAttribute('width');
            row.style.setProperty('width', null);
            row.removeAttribute('height');
            row.style.setProperty('height', null);
        }

        // set width/height for each cell
        for (let i = 0; this.cells && i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                const cell = this.cells[i][j];
                if (cell) {
                    const func =
                        typeof zoomScale == 'number' ? (n: number) => n / zoomScale : zoomScale;
                    const width = cell.width || 0;
                    const height = cell.height || 0;

                    setHTMLElementSizeInPx(
                        cell.td,
                        func?.(width) || width,
                        func?.(height) || height
                    );
                }
            }
        }
    }

    private normalizeSize(sizeTransformer: SizeTransformer | undefined) {
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

function setHTMLElementSizeInPx(
    element: HTMLElement | null | undefined,
    newWidth: number,
    newHeight: number
) {
    if (!!element) {
        element.removeAttribute('width');
        element.removeAttribute('height');
        element.style.boxSizing = 'border-box';
        element.style.width = `${newWidth}px`;
        element.style.height = `${newHeight}px`;
    }
}

function getTableFromTd(td: HTMLTableCellElement) {
    let result: Element | null = <HTMLElement>td;
    for (; result && result.tagName != 'TABLE'; result = result.parentElement) {}
    return <HTMLTableElement>result;
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
function cloneNode<T extends Node>(node: T | null | undefined): T | null {
    let newNode = node ? <T>node.cloneNode(false /*deep*/) : null;
    if (safeInstanceOf(newNode, 'HTMLTableCellElement')) {
        newNode.removeAttribute('id');
        if (!newNode.firstChild) {
            newNode.appendChild(node!.ownerDocument!.createElement('br'));
        }
    }
    return newNode;
}
