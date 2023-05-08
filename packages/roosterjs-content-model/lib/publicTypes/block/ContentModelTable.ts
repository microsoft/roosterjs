import { ContentModelBlockBase } from './ContentModelBlockBase';
import { ContentModelBlockWithCache } from './ContentModelBlockWithCache';
import { ContentModelTableFormat } from '../format/ContentModelTableFormat';
import { ContentModelTableRow } from './ContentModelTableRow';
import { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import { TableMetadataFormat } from '../format/formatParts/TableMetadataFormat';

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
