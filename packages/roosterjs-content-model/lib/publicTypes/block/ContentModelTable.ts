import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockType } from '../enum/BlockType';
import { ContentModelTableCell } from './group/ContentModelTableCell';
import { ContentModelTableFormat } from '../format/ContentModelTableFormat';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import type { CompatibleContentModelBlockType } from '../compatibleEnum/BlockType';

/**
 * Content Model of Table
 */
export interface ContentModelTable
    extends ContentModelBlockBase<
            ContentModelBlockType.Table | CompatibleContentModelBlockType.Table
        >,
        ContentModelWithFormat<ContentModelTableFormat> {
    /**
     * Widths of each column
     */
    widths: number[];

    /**
     * Heights of each row
     */
    heights: number[];
    /**
     * Cells of this table
     */
    cells: ContentModelTableCell[][];
}
