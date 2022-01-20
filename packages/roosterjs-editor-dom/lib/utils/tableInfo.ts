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
    return obj;
}

function safeParseJSON(json: string): any {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}
