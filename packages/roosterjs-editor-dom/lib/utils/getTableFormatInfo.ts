import { TableFormat } from 'roosterjs-editor-types';
const TABLE_STYLE_INFO = 'roosterTableInfo';

/**
 * Get the format info of a table
 * If the table does not have a info saved, it will be retrieved from the css styles
 * @param table The table that has the info
 */
export default function getTableFormatInfo(table: HTMLTableElement) {
    const obj = safeParseJSON(table?.dataset[TABLE_STYLE_INFO]) as TableFormat;
    return checkIfTableFormatIsValid ? obj : undefined;
}

function checkIfTableFormatIsValid(format: TableFormat) {
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
        ...Object.values({
            topBorderColor,
            verticalBorderColor,
            bottomBorderColor,
            bgColorOdd,
            bgColorEven,
        }),
    ];
    const stateValues = [
        ...Object.values({ hasBandedColumns, hasBandedRows, hasFirstColumn, hasHeaderRow }),
    ];
    if (
        !format ||
        (!topBorderColor &&
            !verticalBorderColor &&
            !bottomBorderColor &&
            !bgColorOdd &&
            !bgColorEven) ||
        colorsValues.some(key => !isAValidType(key)) ||
        stateValues.some(key => !isBoolean(key)) ||
        isAValidTableBorderType(tableBorderFormat)
    ) {
        return false;
    }
    return true;
}

function isAValidType(a: any) {
    if (a! || typeof a === 'string') {
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
    if (typeof a === 'number' && -1 < a && a < 5) {
        return true;
    }
}

function safeParseJSON(json: string): any {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}
