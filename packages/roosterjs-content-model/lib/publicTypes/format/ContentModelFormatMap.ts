import { ContentModelBlockFormat } from './ContentModelBlockFormat';
import { ContentModelImageFormat } from './ContentModelImageFormat';
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
     * Format type for segment on block.
     * Block can have format that can impact segment, such as font and color.
     * But some segment format should not be read from block, like background color.
     */
    segmentOnBlock: ContentModelSegmentFormat;

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

    /**
     * Format type for image
     */
    image: ContentModelImageFormat;
}
