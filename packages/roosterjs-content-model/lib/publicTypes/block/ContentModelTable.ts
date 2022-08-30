import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelTableCell } from './group/ContentModelTableCell';
import { ContentModelTableFormat } from '../format/ContentModelTableFormat';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Content Model of Table
 */
export interface ContentModelTable
    extends ContentModelBlockBase<'Table'>,
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
