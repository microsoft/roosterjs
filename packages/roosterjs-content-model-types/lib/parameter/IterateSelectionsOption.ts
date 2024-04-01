import type { ContentModelBlock } from '../block/ContentModelBlock';
import type { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import type { ContentModelSegment } from '../segment/ContentModelSegment';
import type { TableSelectionContext } from '../selection/TableSelectionContext';

/**
 * Options for iterateSelections API
 */
export interface IterateSelectionsOption {
    /**
     * For selected table cell, this property determines how do we handle its content.
     * include: No matter if table cell is selected, always invoke callback function for selected content (default value)
     * ignoreForTable: When the whole table is selected we invoke callback for the table (using block parameter) but skip
     * all its cells and content, otherwise keep invoking callback for table cell and content
     * ignoreForTableOrCell: If whole table is selected, same with ignoreForTable, or if a table cell is selected, only
     * invoke callback for the table cell itself but not for its content, otherwise keep invoking callback for content.
     * @default include
     */
    contentUnderSelectedTableCell?: 'include' | 'ignoreForTable' | 'ignoreForTableOrCell';

    /**
     * For a selected general element, this property determines how do we handle its content.
     * contentOnly: (Default) When the whole general element is selected, we only invoke callback for its selected content
     * generalElementOnly: When the whole general element is selected, we only invoke callback for the general element (using block or
     * segment parameter depends on if it is a block or segment), but skip all its content.
     * both: When general element is selected, we invoke callback first for its content, then for general element itself
     */
    contentUnderSelectedGeneralElement?: 'contentOnly' | 'generalElementOnly' | 'both';

    /**
     * Whether call the callback for the list item format holder segment
     * anySegment: call the callback if any segment is selected under a list item
     * allSegments: call the callback only when all segments under the list item are selected
     * never: never call the callback for list item format holder
     * @default allSegments
     */
    includeListFormatHolder?: 'anySegment' | 'allSegments' | 'never';
}

/**
 * The callback function type for iterateSelections
 * @param path The block group path of current selection
 * @param tableContext Table context of current selection
 * @param block Block of current selection
 * @param segments Segments of current selection
 * @returns True to stop iterating, otherwise keep going
 */
export type IterateSelectionsCallback = (
    path: ContentModelBlockGroup[],
    tableContext?: TableSelectionContext,
    block?: ContentModelBlock,
    segments?: ContentModelSegment[]
) => void | boolean;
