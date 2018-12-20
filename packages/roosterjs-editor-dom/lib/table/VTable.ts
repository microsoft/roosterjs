import { TableFormat, TableOperation } from 'roosterjs-editor-types';

/**
 * Represent a virtual cell of a virtual table
 */
export interface VCell {
    /**
     * The table cell object. The value will be null if this is an expanded virtual cell
     */
    td?: HTMLTableCellElement;

    /**
     * Whether this cell is spanned from left
     */
    spanLeft?: boolean;

    /**
     * Whether this cell is spanned from above
     */
    spanAbove?: boolean;
}

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

    private trs: HTMLTableRowElement[] = [];

    /**
     * Create a new instance of VTable object using HTML TABLE or TD node
     * @param node The HTML Table or TD node
     */
    constructor(node: HTMLTableElement | HTMLTableCellElement) {
        this.table = node instanceof HTMLTableElement ? node : getTableFromTd(node);
        if (this.table) {
            let currentTd = node instanceof HTMLTableElement ? null : node;
            let trs = <HTMLTableRowElement[]>[].slice.call(this.table.rows);
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
                            this.cells[rowIndex + rowSpan][targetCol] = {
                                td: colSpan + rowSpan == 0 ? td : null,
                                spanLeft: colSpan > 0,
                                spanAbove: rowSpan > 0,
                            };
                        }
                    }
                }
            });
        }
    }

    /**
     * Write the virtual table back to DOM tree to represent the change of VTable
     */
    writeBack() {
        if (this.cells) {
            moveChildren(this.table);
            this.cells.forEach((row, r) => {
                let tr = cloneNode(this.trs[r % 2] || this.trs[0]);
                this.table.appendChild(tr);
                row.forEach((cell, c) => {
                    if (cell.td) {
                        this.recalcSpans(r, c);
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
                            moveChildren(belowCell.td, aboveCell.td);
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
                            moveChildren(rightCell.td, leftCell.td);
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

    private getTd(row: number, col: number) {
        if (this.cells) {
            row = Math.min(this.cells.length - 1, row);
            col = Math.min(this.cells[row].length - 1, col);
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

    private recalcSpans(row: number, col: number) {
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
    if (newNode && newNode instanceof HTMLTableCellElement) {
        newNode.removeAttribute('id');
        if (!newNode.firstChild) {
            newNode.appendChild(node.ownerDocument.createElement('br'));
        }
    }
    return newNode;
}

/**
 * Move all children from one node to another
 * @param fromNode The source node to move children from
 * @param toNode Target node. If not passed, children nodes of source node will be removed
 */
function moveChildren(fromNode: Node, toNode?: Node) {
    while (fromNode.firstChild) {
        if (toNode) {
            toNode.appendChild(fromNode.firstChild);
        } else {
            fromNode.removeChild(fromNode.firstChild);
        }
    }
}
