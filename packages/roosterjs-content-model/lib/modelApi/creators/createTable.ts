import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { ContentModelTableFormat } from '../../publicTypes/format/ContentModelTableFormat';

/**
 * @internal
 */
export function createTable(rowCount: number, format?: ContentModelTableFormat): ContentModelTable {
    const rows: ContentModelTableCell[][] = [];

    for (let i = 0; i < rowCount; i++) {
        rows.push([]);
    }

    return {
        blockType: 'Table',
        cells: rows,
        format: { ...(format || {}) },
        widths: [],
        heights: [],
        dataset: {},
    };
}
