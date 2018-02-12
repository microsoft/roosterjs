import { TableFormat } from 'roosterjs-editor-types';

export interface VCell {
    td?: HTMLTableCellElement;
    spanLeft?: boolean;
    spanAbove?: boolean;
}

export default class VTable {
    table: HTMLTableElement;
    cells: VCell[][];
    row: number;
    col: number;
    private trs: HTMLTableRowElement[] = [];

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

    writeBack() {
        if (this.cells) {
            VTable.moveChildren(this.table);
            this.table.style.borderCollapse = 'collapse';
            this.cells.forEach((row, r) => {
                let tr = VTable.cloneNode(this.trs[r % 2] || this.trs[0]);
                this.table.appendChild(tr);
                row.forEach((cell, c) => {
                    if (cell.td) {
                        this.recalcSpans(r, c);
                        tr.appendChild(cell.td);
                    }
                });
            });
        } else {
            this.table.parentNode.removeChild(this.table);
        }
    }

    applyFormat(format: TableFormat) {
        this.trs[0].style.backgroundColor = format.bgColorOdd || 'transparent';
        if (this.trs[1]) {
            this.trs[1].style.backgroundColor = format.bgColorEven || 'transparent';
        }
        this.cells.forEach(row =>
            row.filter(cell => cell.td).forEach(cell => {
                cell.td.style.borderTop = getBorderStyle(format.topBorderColor);
                cell.td.style.borderBottom = getBorderStyle(format.bottomBorderColor);
                cell.td.style.borderLeft = getBorderStyle(format.verticalBorderColor);
                cell.td.style.borderRight = getBorderStyle(format.verticalBorderColor);
            })
        );
    }

    forEachCellOfCurrentColumn(callback: (cell: VCell, row: VCell[], i: number) => void) {
        for (let i = 0; i < this.cells.length; i++) {
            callback(this.getCell(i, this.col), this.cells[i], i);
        }
    }

    forEachCellOfCurrentRow(callback: (cell: VCell, i: number) => void) {
        for (let i = 0; i < this.cells[this.row].length; i++) {
            callback(this.getCell(this.row, i), i);
        }
    }

    getCell(row: number, col: number): VCell {
        return (this.cells[row] && this.cells[row][col]) || {};
    }

    getCurrentTd(): HTMLTableCellElement {
        if (this.cells) {
            let row = Math.min(this.cells.length - 1, this.row);
            let col = Math.min(this.cells[row].length - 1, this.col);
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

    static moveChildren(fromNode: Node, toNode?: Node) {
        while (fromNode.firstChild) {
            if (toNode) {
                toNode.appendChild(fromNode.firstChild);
            } else {
                fromNode.removeChild(fromNode.firstChild);
            }
        }
    }

    static cloneNode<T extends Node>(node: T): T {
        let newNode = node ? <T>node.cloneNode(false /*deep*/) : null;
        if (newNode && newNode instanceof HTMLTableCellElement && !newNode.firstChild) {
            newNode.appendChild(node.ownerDocument.createElement('br'));
        }
        return newNode;
    }

    static cloneCell(cell: VCell): VCell {
        return {
            td: VTable.cloneNode(cell.td),
            spanAbove: cell.spanAbove,
            spanLeft: cell.spanLeft,
        };
    }

    private recalcSpans(row: number, col: number) {
        let td = this.getCell(row, col).td;
        if (td) {
            td.colSpan = 1;
            td.rowSpan = 1;
            for (let i = col + 1; i < this.cells[row].length; i++) {
                let cell = this.getCell(row, i);
                if (cell.td || !cell.spanLeft) {
                    break;
                }
                td.colSpan = i + 1 - col;
            }
            for (let i = row + 1; i < this.cells.length; i++) {
                let cell = this.getCell(i, col);
                if (cell.td || !cell.spanAbove) {
                    break;
                }
                td.rowSpan = i + 1 - row;
            }
        }
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
