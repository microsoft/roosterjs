import { TableBorderFormat, TableFormat } from 'roosterjs-editor-types';

const TABLE_STYLE_INFO = 'roosterTableInfo';
const DEFAULT_FORMAT: TableFormat = {
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
};

/**
 * Get the format info of a table
 * If the table does not have a info saved, it will be retrieved from the css styles
 * @param table The table that has the info
 */
export function getTableFormatInfo(table: HTMLTableElement) {
    const obj = safeParseJSON(table?.dataset[TABLE_STYLE_INFO]) as TableFormat;
    return checkIfTableFormatIsValid(obj) ? obj : DEFAULT_FORMAT;
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
        colorsValues.some(key => !isAValidType(key)) ||
        stateValues.some(key => !isBoolean(key)) ||
        !isAValidTableBorderType(tableBorderFormat)
    ) {
        return false;
    }

    return true;
}

function isAValidType(a: any) {
    if (a === null || a === undefined || typeof a === 'string') {
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

function isAValidTableBorderType(a: any) {
    if (
        a === TableBorderFormat.DEFAULT ||
        a === TableBorderFormat.LIST_WITH_SIDE_BORDERS ||
        a === TableBorderFormat.FIRST_COLUMN_HEADER_EXTERNAL ||
        a === TableBorderFormat.NO_SIDE_BORDERS ||
        a === TableBorderFormat.NO_HEADER_BORDERS ||
        a === TableBorderFormat.ESPECIAL_TYPE_1 ||
        a === TableBorderFormat.ESPECIAL_TYPE_2 ||
        a === TableBorderFormat.ESPECIAL_TYPE_3
    ) {
        return true;
    }
    return false;
}

function safeParseJSON(json: string): any {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * Save the format info of a table
 * @param table The table the info will be saved
 * @param format The format of the table
 */
export function saveTableInfo(table: HTMLTableElement, format: TableFormat) {
    if (table && format) {
        table.dataset[TABLE_STYLE_INFO] = JSON.stringify(format);
    }
}
