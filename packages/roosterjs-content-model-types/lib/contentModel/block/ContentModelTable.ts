import type { ContentModelBlockBase, ReadonlyContentModelBlockBase } from './ContentModelBlockBase';
import type {
    ContentModelTableFormat,
    ReadonlyContentModelTableFormat,
} from '../format/ContentModelTableFormat';
import type { ContentModelTableRow, ReadonlyContentModelTableRow } from './ContentModelTableRow';
import type {
    ContentModelWithDataset,
    ReadonlyContentModelWithDataset,
} from '../format/ContentModelWithDataset';
import type { TableMetadataFormat } from '../format/metadata/TableMetadataFormat';

/**
 * Content Model of Table
 */
export interface ContentModelTable
    extends ContentModelBlockBase<'Table', ContentModelTableFormat, HTMLTableElement>,
        ContentModelWithDataset<TableMetadataFormat> {
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
export interface ReadonlyContentModelTable
    extends ReadonlyContentModelBlockBase<
            'Table',
            ReadonlyContentModelTableFormat,
            HTMLTableElement
        >,
        ReadonlyContentModelWithDataset<TableMetadataFormat> {
    /**
     * Widths of each column
     */
    readonly widths: ReadonlyArray<number>;

    /**
     * Cells of this table
     */
    readonly rows: ReadonlyArray<ReadonlyContentModelTableRow>;
}
