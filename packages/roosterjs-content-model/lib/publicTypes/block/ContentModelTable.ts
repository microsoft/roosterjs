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
     * Format of this table
     * TODO: Add more formats
     */
    format: {};

    /**
     * Cells of this table
     */
    cells: ContentModelTableCell[][];
}
