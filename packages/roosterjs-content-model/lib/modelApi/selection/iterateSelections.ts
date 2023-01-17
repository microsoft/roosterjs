import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';

/**
 * @internal
 */
export interface TableSelectionContext {
    table: ContentModelTable;
    rowIndex: number;
    colIndex: number;
    isWholeTableSelected: boolean;
}

/**
 * @internal
 */
export interface IterateSelectionsOption {
    /**
     * When set to true, and a table cell is marked as selected, all content under this table cell will not be included in result
     */
    ignoreContentUnderSelectedTableCell?: boolean;

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
): boolean {
    const parent = path[0];
    const includeListFormatHolder = option?.includeListFormatHolder || 'allSegments';
    let hasSelectedSegment = false;
    let hasUnselectedSegment = false;

    for (let i = 0; i < parent.blocks.length; i++) {
        const block = parent.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                const newPath = [block, ...path];
                if (iterateSelections(newPath, callback, option, table, treatAllAsSelect)) {
                    return true;
                }
                break;

            case 'Table':
                const cells = block.cells;
                const isWholeTableSelected = cells.every(row => row.every(cell => cell.isSelected));

                if (option?.ignoreContentUnderSelectedTableCell && isWholeTableSelected) {
                    if (callback(path, table, block)) {
                        return true;
                    }
                } else {
                    for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
                        const row = cells[rowIndex];

                        for (let colIndex = 0; colIndex < row.length; colIndex++) {
                            const cell = row[colIndex];

                            const newTable: TableSelectionContext = {
                                table: block,
                                rowIndex,
                                colIndex,
                                isWholeTableSelected,
                            };

                            if (cell.isSelected && callback(path, newTable)) {
                                return true;
                            }

                            if (!cell.isSelected || !option?.ignoreContentUnderSelectedTableCell) {
                                const newPath = [cell, ...path];
                                const isSelected = treatAllAsSelect || cell.isSelected;

                                if (
                                    iterateSelections(
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

                    if (treatAllAsSelect || segment.isSelected) {
                        segments.push(segment);
                        hasSelectedSegment = true;
                    } else if (segment.segmentType == 'General') {
                        const newPath = [segment, ...path];

                        if (iterateSelections(newPath, callback, option, table, treatAllAsSelect)) {
                            return true;
                        }
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
                if (block.isSelected && callback(path, table, block)) {
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
