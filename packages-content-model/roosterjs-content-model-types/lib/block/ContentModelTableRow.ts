import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelBlockWithCache } from './ContentModelBlockWithCache';
import { ContentModelTableCell } from '../group/ContentModelTableCell';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Content Model of Table
 */
export interface ContentModelTableRow
    extends ContentModelBlockWithCache<HTMLTableRowElement>,
        ContentModelWithFormat<ContentModelBlockFormat> {
    /**
     * Heights of each row
     */
    height: number;

    /**
     * Cells of this table
     */
    cells: ContentModelTableCell[];
}
