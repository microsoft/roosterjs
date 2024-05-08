import type { ContentModelBlockFormatCommon } from './ContentModelBlockFormat';
import type { ContentModelCodeFormatCommon } from './ContentModelCodeFormat';
import type { ContentModelDividerFormatCommon } from './ContentModelDividerFormat';
import type { ContentModelEntityFormatCommon } from './ContentModelEntityFormat';
import type { ContentModelFormatContainerFormatCommon } from './ContentModelFormatContainerFormat';
import type { ContentModelHyperLinkFormatCommon } from './ContentModelHyperLinkFormat';
import type { ContentModelImageFormatCommon } from './ContentModelImageFormat';
import type { ContentModelListItemFormatCommon } from './ContentModelListItemFormat';
import type { ContentModelListItemLevelFormatCommon } from './ContentModelListItemLevelFormat';
import type { ContentModelSegmentFormatCommon } from './ContentModelSegmentFormat';
import type { ContentModelTableCellFormatCommon } from './ContentModelTableCellFormat';
import type { ContentModelTableFormatCommon } from './ContentModelTableFormat';
import type { DatasetFormat } from './metadata/DatasetFormat';
import type { SizeFormat } from './formatParts/SizeFormat';

/**
 * A map from Content Model format name to its combined format type
 */
export interface ContentModelFormatMap {
    /**
     * Format type for block
     */
    block: ContentModelBlockFormatCommon;

    /**
     * Format type for style based segment format
     */
    styleBasedSegment: ContentModelSegmentFormatCommon;

    /**
     * Format type for element based segment format
     */
    elementBasedSegment: ContentModelSegmentFormatCommon;

    /**
     * Format type for segment
     */
    segment: ContentModelSegmentFormatCommon;

    /**
     * Format type for segment on block.
     * Block can have format that can impact segment, such as font and color.
     * But some segment format should not be read from block, like background color.
     */
    segmentOnBlock: ContentModelSegmentFormatCommon;

    /**
     * Format type for segment on table cell.
     * This is very similar with segmentOnBlock, without 'textColor'. Because we will keep
     * text color style on table cell to indicate auto calculated segment color when set table cell shade.
     * Segments can set its own text color to override this value
     */
    segmentOnTableCell: ContentModelSegmentFormatCommon;

    /**
     * Format type for table, except alignment related styles
     */
    table: ContentModelTableFormatCommon;

    /**
     * Format type for tableCell
     */
    tableCell: ContentModelTableCellFormatCommon;

    /**
     * Format type for tableRow
     */
    tableRow: ContentModelBlockFormatCommon;

    /**
     * Format type for tableColumn
     */
    tableColumn: SizeFormat;

    /**
     * Format type for table border
     */
    tableBorder: ContentModelTableFormatCommon;

    /**
     * Format type for tableCell border
     */
    tableCellBorder: ContentModelTableCellFormatCommon;

    /**
     * Format type for li element
     */
    listItemElement: ContentModelListItemFormatCommon;

    /**
     * Format type for listItem
     */
    listItemThread: ContentModelListItemLevelFormatCommon;

    /**
     * Format type for listLevel
     */
    listLevel: ContentModelListItemLevelFormatCommon;

    /**
     * Format type for listLevel
     */
    listLevelThread: ContentModelListItemLevelFormatCommon;

    /**
     * Format type for image
     */
    image: ContentModelImageFormatCommon;

    /**
     * Format type for link
     */
    link: ContentModelHyperLinkFormatCommon;

    /**
     * Format type for segment inside link
     */
    segmentUnderLink: ContentModelHyperLinkFormatCommon;

    /**
     * Format type for code
     */
    code: ContentModelCodeFormatCommon;

    /**
     * Format type for dataset
     */
    dataset: DatasetFormat;

    /**
     * Format type for divider
     */
    divider: ContentModelDividerFormatCommon;

    /**
     * Format type for format container
     */
    container: ContentModelFormatContainerFormatCommon;

    /**
     * Format type for entity
     */
    entity: ContentModelEntityFormatCommon;

    /**
     * Format type for general model
     */
    general: ContentModelSegmentFormatCommon;
}
