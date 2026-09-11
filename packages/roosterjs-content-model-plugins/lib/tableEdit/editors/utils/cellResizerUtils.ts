import { createTableCell } from 'roosterjs-content-model-dom';
import type {
    ReadonlyContentModelTable,
    ShallowMutableContentModelTable,
    ShallowMutableContentModelTableCell,
} from 'roosterjs-content-model-types';

export interface CellResizerColumnSplit {
    affectedRows: boolean[];
    boundaryRows: boolean[];
    leftCells: ShallowMutableContentModelTableCell[];
    placeholders: ShallowMutableContentModelTableCell[];
    rightCells: ShallowMutableContentModelTableCell[];
    direction: number;
}

export function getAffectedRows(
    table: ReadonlyContentModelTable,
    column: number,
    anchorRow: number | undefined
): boolean[] {
    const boundaryRows = table.rows.map((_, row) => hasCellBoundary(table, row, column));
    const affectedRows = table.rows.map(() => false);

    if (anchorRow === undefined || !boundaryRows[anchorRow]) {
        return affectedRows;
    }

    affectedRows[anchorRow] = true;

    for (let row = anchorRow - 1; row >= 0 && boundaryRows[row]; row--) {
        affectedRows[row] = true;
    }
    for (let row = anchorRow + 1; row < table.rows.length && boundaryRows[row]; row++) {
        affectedRows[row] = true;
    }

    return affectedRows;
}

export function createColumnSplit(
    table: ShallowMutableContentModelTable,
    column: number,
    affectedRows: boolean[],
    direction: number
): CellResizerColumnSplit {
    const boundaryRows = table.rows.map((_, row) => hasCellBoundary(table, row, column));
    const leftCells: ShallowMutableContentModelTableCell[] = [];
    const placeholders: ShallowMutableContentModelTableCell[] = [];
    const rightCells: ShallowMutableContentModelTableCell[] = [];

    table.rows.forEach(row => {
        const leftCell = row.cells[column] as ShallowMutableContentModelTableCell;
        const rightCell = row.cells[column + 1] as ShallowMutableContentModelTableCell;
        const placeholder = createTableCell(true, rightCell.spanAbove, rightCell.isHeader);

        leftCells.push(leftCell);
        placeholders.push(placeholder);
        rightCells.push(rightCell);
        row.cells.splice(column + 1, 0, placeholder);
    });
    table.widths.splice(column + 1, 0, 0);

    const result = {
        affectedRows,
        boundaryRows,
        leftCells,
        placeholders,
        rightCells,
        direction,
    };

    setColumnSplitDirection(table, column, result, direction);
    return result;
}

export function setColumnSplitDirection(
    table: ShallowMutableContentModelTable,
    column: number,
    split: CellResizerColumnSplit,
    direction: number
) {
    table.rows.forEach((row, rowIndex) => {
        const leftCell = split.leftCells[rowIndex];
        const placeholder = split.placeholders[rowIndex];
        const rightCell = split.rightCells[rowIndex];
        const spanInsertedColumn = split.boundaryRows[rowIndex]
            ? split.affectedRows[rowIndex] == direction > 0
            : true;

        placeholder.spanAbove = spanInsertedColumn ? leftCell.spanAbove : rightCell.spanAbove;
        row.cells.splice(
            column,
            3,
            leftCell,
            ...(spanInsertedColumn ? [placeholder, rightCell] : [rightCell, placeholder])
        );
    });
    split.direction = direction;
}

export function writeTableWidthsToDom(table: ReadonlyContentModelTable) {
    table.rows.forEach(row => {
        for (let column = 0; column < row.cells.length; column++) {
            const cell = row.cells[column];
            const td = cell.cachedElement;

            if (td) {
                let width = table.widths[column];
                let colSpan = 1;

                while (row.cells[column + colSpan]?.spanLeft) {
                    width += table.widths[column + colSpan];
                    colSpan++;
                }

                td.style.boxSizing = 'border-box';
                td.style.width = width + 'px';
                td.colSpan = colSpan;
            }
        }
    });
}

function hasCellBoundary(table: ReadonlyContentModelTable, row: number, column: number): boolean {
    return getCellRoot(table, row, column) != getCellRoot(table, row, column + 1);
}

function getCellRoot(table: ReadonlyContentModelTable, row: number, column: number): string {
    let currentRow = row;
    let currentColumn = column;
    let cell = table.rows[currentRow]?.cells[currentColumn];

    while (cell?.spanAbove || cell?.spanLeft) {
        currentRow -= cell.spanAbove ? 1 : 0;
        currentColumn -= cell.spanLeft ? 1 : 0;
        cell = table.rows[currentRow]?.cells[currentColumn];
    }

    return currentRow + ':' + currentColumn;
}
