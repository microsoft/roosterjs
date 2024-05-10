import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelBlockWithCache } from '../common/ContentModelBlockWithCache';
import type { ContentModelTableCell } from '../blockGroup/ContentModelTableCell';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import type { ReadonlyContentModel } from '../common/Mutable';

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

/**
 * Content Model of Table Row (Readonly)
 */
export type ReadonlyContentModelTableRow = ReadonlyContentModel<ContentModelTableRow>;
