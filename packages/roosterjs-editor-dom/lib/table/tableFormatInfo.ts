import { TableFormat } from 'roosterjs-editor-types';

const TABLE_STYLE_INFO = 'roosterTableInfo';

/**
 * @internal
 * Get the format info of a table
 * If the table does not have a info saved, it will be retrieved from the css styles
 * @param table The table that has the info
 */
export function getTableFormatInfo(table: HTMLTableElement) {
    const obj = safeParseJSON(table?.dataset[TABLE_STYLE_INFO]) as TableFormat;
    return checkIfTableFormatIsValid(obj) ? obj : null;
}

/**
 * @internal
 * Save the format info of a table
 * @param table The table the info will be saved
 * @param format The format of the table
 */
export function saveTableInfo(table: HTMLTableElement, format: TableFormat) {
    if (table && format) {
        table.dataset[TABLE_STYLE_INFO] = JSON.stringify(format);
    }
}

function checkIfTableFormatIsValid(format: TableFormat) {
    if (!format) {
        return false;
    }
    const {
        topBorderColor,
        verticalBorderColor,
        bottomBorderColor,
        bgColorOdd,
        bgColorEven,
        hasBandedColumns,
        hasBandedRows,
        hasFirstColumn,
        hasHeaderRow,
        tableBorderFormat,
    } = format;
    const colorsValues = [
        topBorderColor,
        verticalBorderColor,
        bottomBorderColor,
        bgColorOdd,
        bgColorEven,
    ];
    const stateValues = [hasBandedColumns, hasBandedRows, hasFirstColumn, hasHeaderRow];

    if (
        colorsValues.some(key => !isAValidColor(key)) ||
        stateValues.some(key => !isBoolean(key)) ||
        !isAValidTableBorderType(tableBorderFormat)
    ) {
        return false;
    }

    return true;
}

function isAValidColor(color: any) {
    if (color === null || color === undefined || typeof color === 'string') {
        return true;
    }
    return false;
}

function isBoolean(a: any) {
    if (typeof a === 'boolean') {
        return true;
    }
    return false;
}

function isAValidTableBorderType(border: any) {
    if (-1 < border && border < 8) {
        return true;
    }
    return false;
}

function safeParseJSON(json: string | undefined): any {
    if (!json) {
        return null;
    }
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}
