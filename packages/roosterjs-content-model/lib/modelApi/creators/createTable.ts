import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableFormat } from '../../publicTypes/format/ContentModelTableFormat';
import { ContentModelTableRow } from '../../publicTypes/block/ContentModelTableRow';

/**
 * @internal
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
