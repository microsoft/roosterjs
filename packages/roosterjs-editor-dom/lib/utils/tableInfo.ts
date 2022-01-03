import toArray from './toArray';
import { TableFormat } from 'roosterjs-editor-types';

const TABLE_STYLE_INFO = 'roosterTableInfo';

/**
 * Save the format info of a table
 * @param table The table the info will be saved
 * @param format The format of the table
 */
export function saveTableInfo(table: HTMLTableElement, format: Partial<TableFormat>) {
    if (table && format) {
        table.dataset[TABLE_STYLE_INFO] = JSON.stringify(format);
    }
}

/**
 * Delete the format info of a table
 * @param table The table the info will be deleted
 */
export function deleteTableInfo(table: HTMLTableElement) {
    if (table) {
        delete table.dataset[TABLE_STYLE_INFO];
    }
}

/**
 * Get the format info of a table
 * If the table does not have a info saved, it will be retrieved from the css styles
 * @param table The table that has the info
 */
export function getTableFormatInfo(table: HTMLTableElement): Partial<TableFormat> {
    const obj = safeParseJSON(table?.dataset[TABLE_STYLE_INFO]) as TableFormat;
    return obj ? obj : getPastedTableStyle(table);
}

function safeParseJSON(json: string): any {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function getPastedTableStyle(table: HTMLTableElement): Partial<TableFormat> {
    const headerRowBg = getCellsOfRow(table, 0)[0].style.backgroundColor;
    const headerRow =
        headerRowBg === getCellsOfRow(table, 1)[0].style.backgroundColor ? false : true;
    const firstRow = getCellsOfColumn(table, 0)[1].style.borderBottom === 'none' ? true : false;
    const oddRowCell = getCellsOfRow(table, 1)[1];
    const evenRowCell = getCellsOfRow(table, 2)[1];
    const topBorderColor = oddRowCell.style.borderTopColor;
    const bottomBorderColor = oddRowCell.style.borderBottomColor;
    const verticalBorderColor = oddRowCell.style.borderRightColor;
    const oddCellBg = oddRowCell.style.backgroundColor;
    const evenCellBg = evenRowCell.style.backgroundColor;
    const bandedRows = oddCellBg === evenCellBg ? false : true;
    const oddColumnCell = getCellsOfColumn(table, 1)[1];
    const evenColumnCell = getCellsOfColumn(table, 2)[1];
    const oddColumnCellBg = oddColumnCell.style.backgroundColor;
    const evenColumnCellBg = evenColumnCell.style.backgroundColor;
    const bandedColumns = oddColumnCellBg === evenColumnCellBg ? false : true;
    return {
        topBorderColor: topBorderColor,
        bottomBorderColor: bottomBorderColor,
        verticalBorderColor: verticalBorderColor,
        headerRow: headerRow,
        firstColumn: firstRow,
        bandedRows: bandedRows,
        bandedColumns: bandedColumns,
        bgColumnColorEven: evenColumnCellBg,
        bgColumnColorOdd: oddColumnCellBg,
        bgColorEven: evenCellBg,
        bgColorOdd: oddCellBg,
        headerRowColor: headerRowBg,
    };
}

function getCellsOfRow(table: HTMLTableElement, rowNumber: number): HTMLTableCellElement[] {
    if (rowNumber > table.rows.length || !table) {
        return;
    }
    const cells = table.rows[rowNumber].cells;
    return toArray(cells);
}

function getCellsOfColumn(table: HTMLTableElement, columnNumber: number): HTMLTableCellElement[] {
    const rowsLength = table.rows.length;
    let column: HTMLTableCellElement[] = [];
    for (let i = 0; i < rowsLength; i++) {
        column = [...column, table.rows[i].cells[columnNumber]];
    }
    return column;
}
