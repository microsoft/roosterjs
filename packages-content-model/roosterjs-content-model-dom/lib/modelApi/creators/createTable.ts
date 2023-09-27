import type {
    ContentModelTable,
    ContentModelTableFormat,
    ContentModelTableRow,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelTable model
 * @param rowCount Count of rows of this table
 * @param format @optional The format of this model
 */
export function createTable(rowCount: number, format?: ContentModelTableFormat): ContentModelTable {
    const rows: ContentModelTableRow[] = [];

    for (let i = 0; i < rowCount; i++) {
        rows.push({
            height: 0,
            format: {},
            cells: [],
        });
    }

    return {
        blockType: 'Table',
        rows,
        format: { ...(format || {}) },
        widths: [],
        dataset: {},
    };
}
