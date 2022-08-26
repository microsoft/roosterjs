import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';

/**
 * @internal
 */
export function createTable(rowCount: number): ContentModelTable {
    const rows: ContentModelTableCell[][] = [];

    for (let i = 0; i < rowCount; i++) {
        rows.push([]);
    }

    return {
        blockType: ContentModelBlockType.Table,
        cells: rows,
        format: {},
        widths: [],
        heights: [],
    };
}
