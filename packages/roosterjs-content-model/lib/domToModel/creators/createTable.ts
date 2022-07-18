import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { tempCreateAttributes } from './tempCreateAttributes';

/**
 * @internal
 */
export function createTable(table: HTMLTableElement): ContentModelTable {
    return {
        blockType: ContentModelBlockType.Table,
        cells: Array.from(table.rows).map(_ => []),
        tempAttributes: tempCreateAttributes(table),
    };
}
