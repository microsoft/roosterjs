import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { ContentModelDividerFormat } from './ContentModelDividerFormat';
import type { ContentModelFormatContainerFormat } from './ContentModelFormatContainerFormat';
import type { ContentModelHyperLinkFormat } from './ContentModelHyperLinkFormat';
import type { ContentModelImageFormat } from './ContentModelImageFormat';
import type { ContentModelListItemFormat } from './ContentModelListItemFormat';
import type { ContentModelListItemLevelFormat } from './ContentModelListItemLevelFormat';
import type { ContentModelSegmentFormat } from './ContentModelSegmentFormat';
import type { ContentModelTableCellFormat } from './ContentModelTableCellFormat';
import type { ContentModelTableFormat } from './ContentModelTableFormat';
import type { DatasetFormat } from './metadata/DatasetFormat';
import type { FontFamilyFormat } from './formatParts/FontFamilyFormat';

/**
 * A map from Content Model format name to its combined format type
 */
export interface ContentModelFormatMap {
    /**
     * Format type for block
     */
    block: ContentModelBlockFormat;

    /**
     * Format type for style based segment format
     */
    styleBasedSegment: ContentModelSegmentFormat;

    /**
     * Format type for element based segment format
     */
    elementBasedSegment: ContentModelSegmentFormat;

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
     * Format type for segment on table cell.
     * This is very similar with segmentOnBlock, without 'textColor'. Because we will keep
     * text color style on table cell to indicate auto calculated segment color when set table cell shade.
     * Segments can set its own text color to override this value
     */
    segmentOnTableCell: ContentModelSegmentFormat;

    /**
     * Format type for table, except alignment related styles
     */
    table: ContentModelTableFormat;

    /**
     * Format type for tableCell
     */
    tableCell: ContentModelTableCellFormat;

    /**
     * Format type for tableRow
     */
    tableRow: ContentModelBlockFormat;

    /**
     * Format type for table border
     */
    tableBorder: ContentModelTableFormat;

    /**
     * Format type for tableCell border
     */
    tableCellBorder: ContentModelTableCellFormat;

    /**
     * Format type for li element
     */
    listItemElement: ContentModelListItemFormat;

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
    link: ContentModelHyperLinkFormat;

    /**
     * Format type for segment inside link
     */
    segmentUnderLink: ContentModelHyperLinkFormat;

    /**
     * Format type for code
     */
    code: FontFamilyFormat;

    /**
     * Format type for dataset
     */
    dataset: DatasetFormat;

    /**
     * Format type for divider
     */
    divider: ContentModelDividerFormat;

    /**
     * Format type for format container
     */
    container: ContentModelFormatContainerFormat;
}
