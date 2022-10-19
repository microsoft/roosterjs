import { ContentModelBlockFormat } from './ContentModelBlockFormat';
import { ContentModelListItemLevelFormat } from './ContentModelListItemLevelFormat';
import { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import { ContentModelTableCellFormat } from './ContentModelTableCellFormat';
import { ContentModelTableFormat } from './ContentModelTableFormat';

/**
 * A map from Content Model format name to its combined format type
 */
export interface ContentModelFormatMap {
    /**
     * Format type for block
     */
    block: ContentModelBlockFormat;

    /**
     * Format type for segment
     */
    segment: ContentModelSegmentFormat;

    /**
     * Format type for table
     */
    table: ContentModelTableFormat;

    /**
     * Format type for tableCell
     */
    tableCell: ContentModelTableCellFormat;

    /**
     * Format type for listItem
     */
    listItem: ContentModelListItemLevelFormat;

    /**
     * Format type for listLevel
     */
    listLevel: ContentModelListItemLevelFormat;
}
