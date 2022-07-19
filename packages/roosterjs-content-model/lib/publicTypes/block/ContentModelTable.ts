import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockType } from '../enum/BlockType';
import { ContentModelTableCell } from './group/ContentModelTableCell';
import { ContentModelTableFormat } from '../format/ContentModelTableFormat';
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
     */
    format: ContentModelTableFormat;

    /**
     * Cells of this table
     */
    cells: ContentModelTableCell[][];
}
