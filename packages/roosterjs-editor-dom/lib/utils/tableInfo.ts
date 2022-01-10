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
        (getCellsOfRow(table, 1)[0] &&
            headerRowBg === getCellsOfRow(table, 1)[0].style.backgroundColor) ||
        (getCellsOfRow(table, 2)[1] &&
            headerRowBg === getCellsOfRow(table, 2)[1].style.backgroundColor)
            ? false
            : true;
    const firstRow =
        getCellsOfColumn(table, 0)[1] && getCellsOfColumn(table, 0)[1].style.borderBottom === 'none'
            ? true
            : false;
    const oddRowCell = getCellsOfColumn(table, 1)[1];
    const evenRowCell = getCellsOfColumn(table, 1)[2];
    const topBorderColor = oddRowCell && oddRowCell.style.borderBottomColor;
    const bottomBorderColor = oddRowCell && oddRowCell.style.borderBottomColor;
    const verticalBorderColor = oddRowCell && oddRowCell.style.borderRightColor;
    const oddCellBg = oddRowCell && oddRowCell.style.backgroundColor;
    const evenCellBg = evenRowCell && evenRowCell.style.backgroundColor;
    const bandedRows = oddCellBg === evenCellBg ? false : true;
    const oddColumnCell = getCellsOfRow(table, 1)[1];
    const evenColumnCell = getCellsOfRow(table, 1)[2];
    const oddColumnCellBg = oddColumnCell && oddColumnCell.style.backgroundColor;
    const evenColumnCellBg = evenColumnCell && evenColumnCell.style.backgroundColor;
    const bandedColumns = oddColumnCellBg === evenColumnCellBg ? false : true;

    return {
        topBorderColor: topBorderColor,
        bottomBorderColor: bottomBorderColor,
        verticalBorderColor: verticalBorderColor,
        headerRow: headerRow,
        firstColumn: firstRow,
        bandedRows: bandedRows,
        bandedColumns: bandedColumns,
        bgColumnColorEven: bandedColumns ? evenColumnCellBg : null,
        bgColumnColorOdd: bandedColumns ? oddColumnCellBg : setLightColor(bottomBorderColor),
        bgColorEven: bandedRows ? evenCellBg : null,
        bgColorOdd: bandedRows ? oddCellBg : setLightColor(bottomBorderColor),
        headerRowColor: headerRow ? headerRowBg : bottomBorderColor,
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

function setLightColor(rgb: string) {
    if (!rgb) {
        return;
    }
    const isRGB = rgb.split('(')[0] === 'rgb' ? true : false;
    if (isRGB) {
        const numberColors = rgb.split('rgb(')[1].split(')')[0];
        rgb = `rgba(${numberColors}, 0.125)`;
    }
    return rgb;
}
