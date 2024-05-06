import type { Mutable } from '../common/Mutable';
import type {
    ContentModelBlockFormat,
    ReadonlyContentModelBlockFormat,
} from '../format/ContentModelBlockFormat';
import type { ContentModelBlockWithCache } from '../common/ContentModelBlockWithCache';
import type {
    ContentModelTableCell,
    ReadonlyContentModelTableCell,
} from '../blockGroup/ContentModelTableCell';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';

/**
 * Common part of Content Model of Table
 */
export interface ContentModelTableRowCommon {
    /**
     * Heights of each row
     */
    height: number;
}

/**
 * Content Model of Table
 */
export interface ContentModelTableRow
    extends Mutable,
        ContentModelTableRowCommon,
        ContentModelBlockWithCache<HTMLTableRowElement>,
        ContentModelWithFormat<ContentModelBlockFormat> {
    /**
     * Cells of this table
     */
    cells: ContentModelTableCell[];
}

/**
 * Content Model of Table (Readonly)
 */
export interface ReadonlyContentModelTableRow
    extends ContentModelBlockWithCache<HTMLTableRowElement>,
        ReadonlyContentModelWithFormat<ReadonlyContentModelBlockFormat>,
        Readonly<ContentModelTableRowCommon> {
    /**
     * Cells of this table
     */
    readonly cells: ReadonlyArray<ReadonlyContentModelTableCell>;
}
