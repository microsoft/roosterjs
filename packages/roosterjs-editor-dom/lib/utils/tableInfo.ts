import { format } from 'path';
import { TableFormat } from 'roosterjs-editor-types';

const TABLE_STYLE_INFO = 'roosterTableInfo';
const DEFAULT_FORMAT: Partial<TableFormat> = {
    bgColor: null,
    topBorderColor: '#ABABAB',
    bottomBorderColor: '#ABABAB',
    verticalBorderColor: '#ABABAB',
    headerRow: false,
    firstColumn: false,
    bandedRows: false,
    bandedColumns: false,
    bgColumnColorEven: null,
    bgColumnColorOdd: '#ABABAB20',
    bgColorEven: null,
    bgColorOdd: '#ABABAB20',
    headerRowColor: '#ABABAB',
    tableBorderFormat: null,
};

/**
 * Save the format info of a table
 * @param table The table the info will be saved
 * @param format The format of the table
 */
export function saveTableInfo(table: HTMLTableElement, format?: Partial<TableFormat>) {
    if (table) {
        table.dataset[TABLE_STYLE_INFO] = JSON.stringify(format ? format : DEFAULT_FORMAT);
    }
}

/**
 * Delete the format info of a table
 * @param table The table the info will be deleted
 */
export function deleteTableInfo(table: HTMLTableElement) {
    if (table && format) {
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
    return obj;
}

function safeParseJSON(json: string): any {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}
