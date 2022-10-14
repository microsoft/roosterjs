import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelTableCell } from '../group/ContentModelTableCell';
import { ContentModelTableFormat } from '../format/ContentModelTableFormat';

/**
 * Content Model of Table
 */
export interface ContentModelTable extends ContentModelBlockBase<'Table', ContentModelTableFormat> {
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
