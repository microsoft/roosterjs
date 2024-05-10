import type { ContentModelBlockBase } from './ContentModelBlockBase';
import type { ContentModelBlockWithCache } from '../common/ContentModelBlockWithCache';
import type { ContentModelTableFormat } from '../format/ContentModelTableFormat';
import type { ContentModelTableRow } from './ContentModelTableRow';
import type { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import type { TableMetadataFormat } from '../format/metadata/TableMetadataFormat';
import type { ReadonlyContentModel } from '../common/Mutable';

/**
 * Content Model of Table
 */
export interface ContentModelTable
    extends ContentModelBlockBase<'Table', ContentModelTableFormat>,
        ContentModelWithDataset<TableMetadataFormat>,
        ContentModelBlockWithCache<HTMLTableElement> {
    /**
     * Widths of each column
     */
    widths: number[];

    /**
     * Cells of this table
     */
    rows: ContentModelTableRow[];
}

/**
 * Content Model of Table (Readonly)
 */
export type ReadonlyContentModelTable = ReadonlyContentModel<ContentModelTable>;
