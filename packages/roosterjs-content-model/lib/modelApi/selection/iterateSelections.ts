import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelBlockWithCache } from '../../publicTypes/block/ContentModelBlockWithCache';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { TableSelectionContext } from '../../publicTypes/selection/TableSelectionContext';

/**
 * @internal
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
 * @internal
 * @returns True to stop iterating, otherwise keep going
 */
export type IterateSelectionsCallback = (
    path: ContentModelBlockGroup[],
    tableContext?: TableSelectionContext,
    block?: ContentModelBlock,
    segments?: ContentModelSegment[]
) => void | boolean;

/**
 * @internal
 * @returns True to stop iterating, otherwise keep going
 */
export function iterateSelections(
    path: ContentModelBlockGroup[],
    callback: IterateSelectionsCallback,
    option?: IterateSelectionsOption,
    table?: TableSelectionContext,
    treatAllAsSelect?: boolean
) {
    const internalCallback: IterateSelectionsCallback = (path, tableContext, block, segments) => {
        if (!!(block as ContentModelBlockWithCache)?.cachedElement) {
            // TODO: This is a temporary solution. A better solution would be making all results from iterationSelection() to be readonly,
            // use a util function to change it to be editable before edit them where we clear its cached element
            delete (block as ContentModelBlockWithCache).cachedElement;
        }

        return callback(path, tableContext, block, segments);
    };

    internalIterateSelections(path, internalCallback, option, table, treatAllAsSelect);
}

function internalIterateSelections(
    path: ContentModelBlockGroup[],
    callback: IterateSelectionsCallback,
    option?: IterateSelectionsOption,
    table?: TableSelectionContext,
    treatAllAsSelect?: boolean
): boolean {
    const parent = path[0];
    const includeListFormatHolder = option?.includeListFormatHolder || 'allSegments';
    const contentUnderSelectedTableCell = option?.contentUnderSelectedTableCell || 'include';
    const contentUnderSelectedGeneralElement =
        option?.contentUnderSelectedGeneralElement || 'contentOnly';

    let hasSelectedSegment = false;
    let hasUnselectedSegment = false;

    for (let i = 0; i < parent.blocks.length; i++) {
        const block = parent.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                const newPath = [block, ...path];

                if (block.blockGroupType == 'General') {
                    const isSelected = treatAllAsSelect || block.isSelected;
                    const handleGeneralContent =
                        !isSelected ||
                        contentUnderSelectedGeneralElement == 'both' ||
                        contentUnderSelectedGeneralElement == 'contentOnly';
                    const handleGeneralElement =
                        isSelected &&
                        (contentUnderSelectedGeneralElement == 'both' ||
                            contentUnderSelectedGeneralElement == 'generalElementOnly' ||
                            block.blocks.length == 0);

                    if (
                        (handleGeneralContent &&
                            internalIterateSelections(
                                newPath,
                                callback,
                                option,
                                table,
                                isSelected
                            )) ||
                        (handleGeneralElement && callback(path, table, block))
                    ) {
                        return true;
                    }
                } else if (
                    internalIterateSelections(newPath, callback, option, table, treatAllAsSelect)
                ) {
                    return true;
                }
                break;

            case 'Table':
                const rows = block.rows;
                const isWholeTableSelected = rows.every(row =>
                    row.cells.every(cell => cell.isSelected)
                );

                if (contentUnderSelectedTableCell != 'include' && isWholeTableSelected) {
                    if (callback(path, table, block)) {
                        return true;
                    }
                } else {
                    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                        const row = rows[rowIndex];

                        for (let colIndex = 0; colIndex < row.cells.length; colIndex++) {
                            const cell = row.cells[colIndex];
                            if (!cell) {
                                continue;
                            }

                            const newTable: TableSelectionContext = {
                                table: block,
                                rowIndex,
                                colIndex,
                                isWholeTableSelected,
                            };

                            if (cell.isSelected && callback(path, newTable)) {
                                return true;
                            }

                            if (
                                !cell.isSelected ||
                                contentUnderSelectedTableCell != 'ignoreForTableOrCell'
                            ) {
                                const newPath = [cell, ...path];
                                const isSelected = treatAllAsSelect || cell.isSelected;

                                if (
                                    internalIterateSelections(
                                        newPath,
                                        callback,
                                        option,
                                        newTable,
                                        isSelected
                                    )
                                ) {
                                    return true;
                                }
                            }
                        }
                    }
                }

                break;

            case 'Paragraph':
                const segments: ContentModelSegment[] = [];

                for (let i = 0; i < block.segments.length; i++) {
                    const segment = block.segments[i];
                    const isSelected = treatAllAsSelect || segment.isSelected;

                    if (segment.segmentType == 'General') {
                        const handleGeneralContent =
                            !isSelected ||
                            contentUnderSelectedGeneralElement == 'both' ||
                            contentUnderSelectedGeneralElement == 'contentOnly';
                        const handleGeneralElement =
                            isSelected &&
                            (contentUnderSelectedGeneralElement == 'both' ||
                                contentUnderSelectedGeneralElement == 'generalElementOnly' ||
                                segment.blocks.length == 0);

                        if (
                            handleGeneralContent &&
                            internalIterateSelections(
                                [segment, ...path],
                                callback,
                                option,
                                table,
                                isSelected
                            )
                        ) {
                            return true;
                        }

                        if (handleGeneralElement) {
                            segments.push(segment);
                        }
                    } else if (isSelected) {
                        segments.push(segment);
                    }

                    if (isSelected) {
                        hasSelectedSegment = true;
                    } else {
                        hasUnselectedSegment = true;
                    }
                }

                if (segments.length > 0 && callback(path, table, block, segments)) {
                    return true;
                }
                break;

            case 'Divider':
            case 'Entity':
                if ((treatAllAsSelect || block.isSelected) && callback(path, table, block)) {
                    return true;
                }

                break;
        }
    }

    if (
        includeListFormatHolder != 'never' &&
        parent.blockGroupType == 'ListItem' &&
        hasSelectedSegment &&
        (!hasUnselectedSegment || includeListFormatHolder == 'anySegment') &&
        // When whole list item is selected, also add its format holder as selected segment
        callback(path, table, undefined /*block*/, [parent.formatHolder])
    ) {
        return true;
    }

    return false;
}
