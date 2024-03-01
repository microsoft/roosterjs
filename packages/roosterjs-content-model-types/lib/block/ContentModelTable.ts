import type { ContentModelBlockBase } from './ContentModelBlockBase';
import type { ContentModelBlockWithCache } from './ContentModelBlockWithCache';
import type { ContentModelTableFormat } from '../format/ContentModelTableFormat';
import type { ContentModelTableRow } from './ContentModelTableRow';
import type { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import type { TableMetadataFormat } from '../format/metadata/TableMetadataFormat';

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
