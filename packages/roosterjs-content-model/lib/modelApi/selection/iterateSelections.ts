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
}

/**
 * @internal
 */
export interface IterateSelectionsOption {
    /**
     * When set to true, and a table cell is marked as selected, all content under this table cell will not be included in result
     */
    ignoreContentUnderSelectedTableCell?: boolean;
}

/**
 * @internal
 */
export type IterateSelectionsCallback = (
    path: ContentModelBlockGroup[],
    tableContext?: TableSelectionContext,
    block?: ContentModelBlock,
    segments?: ContentModelSegment[]
) => void;

/**
 * @internal
 */
export function iterateSelections(
    path: ContentModelBlockGroup[],
    callback: IterateSelectionsCallback,
    option?: IterateSelectionsOption,
    table?: TableSelectionContext,
    treatAllAsSelect?: boolean
) {
    const parent = path[0];
    let hasSelectedSegment = false;
    let hasUnselectedSegment = false;

    for (let i = 0; i < parent.blocks.length; i++) {
        const block = parent.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                const newPath = [block, ...path];
                iterateSelections(newPath, callback, option, table, treatAllAsSelect);
                break;

            case 'Table':
                if (
                    option?.ignoreContentUnderSelectedTableCell &&
                    block.cells.every(row => row.every(cell => cell.isSelected))
                ) {
                    callback(path, table, block);
                } else {
                    block.cells.forEach((row, rowIndex) => {
                        row.forEach((cell, colIndex) => {
                            const newTable: TableSelectionContext = {
                                table: block,
                                rowIndex,
                                colIndex,
                            };

                            if (cell.isSelected) {
                                callback(path, newTable);
                            }

                            if (!cell.isSelected || !option?.ignoreContentUnderSelectedTableCell) {
                                const newPath = [cell, ...path];
                                const isSelected = treatAllAsSelect || cell.isSelected;

                                iterateSelections(newPath, callback, option, newTable, isSelected);
                            }
                        });
                    });
                }

                break;

            case 'Paragraph':
                const segments: ContentModelSegment[] = [];

                block.segments.forEach(segment => {
                    if (treatAllAsSelect || segment.isSelected) {
                        segments.push(segment);
                        hasSelectedSegment = true;
                    } else if (segment.segmentType == 'General') {
                        const newPath = [segment, ...path];

                        iterateSelections(newPath, callback, option, table, treatAllAsSelect);
                    } else {
                        hasUnselectedSegment = true;
                    }
                });

                if (segments.length > 0) {
                    callback(path, table, block, segments);
                }
                break;

            case 'Divider':
            case 'Entity':
                if (block.isSelected) {
                    callback(path, table, block);
                }

                break;
        }
    }

    if (parent.blockGroupType == 'ListItem' && hasSelectedSegment && !hasUnselectedSegment) {
        // When whole list item is selected, also add its format holder as selected segment
        callback(path, table, undefined /*block*/, [parent.formatHolder]);
    }
}
