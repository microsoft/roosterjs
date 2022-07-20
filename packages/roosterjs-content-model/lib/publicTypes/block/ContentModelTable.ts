import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockType } from '../enum/BlockType';
import { ContentModelTableCell } from './group/ContentModelTableCell';
import type { CompatibleContentModelBlockType } from '../compatibleEnum/BlockType';

/**
 * Content Model of Table
 */
export interface ContentModelTable
    extends ContentModelBlockBase<
        ContentModelBlockType.Table | CompatibleContentModelBlockType.Table
    > {
    /**
     * Cells of this table
     */
    cells: ContentModelTableCell[][];
}
