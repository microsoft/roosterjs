import { createTableRow } from './createTableRow';
import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelTable,
    ReadonlyContentModelTable,
    ReadonlyContentModelTableFormat,
    ReadonlyContentModelTableRow,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelTable model
 * @param rowCount Count of rows of this table
 * @param format @optional The format of this model
 */
export function createTable(
    rowCount: number,
    format?: ReadonlyContentModelTableFormat
): ContentModelTable {
    const rows: ReadonlyContentModelTableRow[] = [];

    for (let i = 0; i < rowCount; i++) {
        rows.push(createTableRow());
    }

    const result: ReadonlyContentModelTable = {
        blockType: 'Table',
        rows,
        format: { ...(format || {}) },
        widths: [],
        dataset: {},
    };

    return internalConvertToMutableType(result);
}
