import { ContentModelBlockFormat } from './ContentModelBlockFormat';
import { ContentModelDividerFormat } from './ContentModelDividerFormat';
import { ContentModelImageFormat } from './ContentModelImageFormat';
import { ContentModelListItemLevelFormat } from './ContentModelListItemLevelFormat';
import { ContentModelQuoteFormat } from './ContentModelQuoteFormat';
import { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import { ContentModelTableCellFormat } from './ContentModelTableCellFormat';
import { ContentModelTableFormat } from './ContentModelTableFormat';
import { DatasetFormat } from './formatParts/DatasetFormat';
import { LinkFormat } from '../../publicTypes/format/formatParts/LinkFormat';

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

    /**
     * Format type for link
     */
    link: LinkFormat;

    /**
     * Format type for dataset
     */
    dataset: DatasetFormat;

    /**
     * Format type for quote
     */
    quote: ContentModelQuoteFormat;

    /**
     * Format type for divider
     */
    divider: ContentModelDividerFormat;
}
