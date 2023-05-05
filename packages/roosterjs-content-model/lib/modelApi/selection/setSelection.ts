import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { Coordinates } from 'roosterjs-editor-types';
import { isGeneralSegment } from '../common/isGeneralSegment';
import { Selectable } from '../../publicTypes/selection/Selectable';

/**
 * @internal
 */
export function setSelection(group: ContentModelBlockGroup, start?: Selectable, end?: Selectable) {
    setSelectionToBlockGroup(group, false /*isInSelection*/, start || null, end || null);
}

function setSelectionToBlockGroup(
    group: ContentModelBlockGroup,
    isInSelection: boolean,
    start: Selectable | null,
    end: Selectable | null
): boolean {
    return handleSelection(isInSelection, group, start, end, isInSelection => {
        if (isGeneralSegment(group)) {
            setIsSelected(group, isInSelection);
        }

        group.blocks.forEach(block => {
            isInSelection = setSelectionToBlock(block, isInSelection, start, end);
        });

        return isInSelection;
    });
}

function setSelectionToBlock(
    block: ContentModelBlock,
    isInSelection: boolean,
    start: Selectable | null,
    end: Selectable | null
) {
    switch (block.blockType) {
        case 'BlockGroup':
            return setSelectionToBlockGroup(block, isInSelection, start, end);

        case 'Table':
            return setSelectionToTable(block, isInSelection, start, end);

        case 'Divider':
        case 'Entity':
            return handleSelection(isInSelection, block, start, end, isInSelection => {
                if (isInSelection) {
                    block.isSelected = true;
                } else {
                    delete block.isSelected;
                }

                return isInSelection;
            });

        case 'Paragraph':
            const segmentsToDelete: number[] = [];

            block.segments.forEach((segment, i) => {
                isInSelection = handleSelection(
                    isInSelection,
                    segment,
                    start,
                    end,
                    isInSelection => {
                        return setSelectionToSegment(
                            segment,
                            isInSelection,
                            segmentsToDelete,
                            start,
                            end,
                            i
                        );
                    }
                );
            });

            while (segmentsToDelete.length > 0) {
                const index = segmentsToDelete.pop()!;

                if (index >= 0) {
                    block.segments.splice(index, 1);
                }
            }

            return isInSelection;

        default:
            return isInSelection;
    }
}

function setSelectionToTable(
    table: ContentModelTable,
    isInSelection: boolean,
    start: Selectable | null,
    end: Selectable | null
): boolean {
    const startCo = findCell(table, start);
    const endCo = end ? findCell(table, end) : startCo;

    if (!isInSelection && startCo && endCo) {
        for (let row = 0; row < table.rows.length; row++) {
            for (let col = 0; col < table.rows[row].cells.length; col++) {
                const isSelected =
                    row >= startCo.y && row <= endCo.y && col >= startCo.x && col <= endCo.x;

                setIsSelected(table.rows[row].cells[col], isSelected);
            }
        }
    } else {
        table.rows.forEach(row =>
            row.cells.forEach(cell => {
                isInSelection = setSelectionToBlockGroup(cell, isInSelection, start, end);
            })
        );
    }

    return isInSelection;
}

function findCell(table: ContentModelTable, cell: Selectable | null): Coordinates | undefined {
    let x = -1;
    let y = -1;

    if (cell) {
        for (let row = 0; y < 0 && row < table.rows.length; row++) {
            for (let col = 0; x < 0 && col < table.rows[row].cells.length; col++) {
                if (table.rows[row].cells[col] == cell) {
                    x = col;
                    y = row;
                }
            }
        }
    }

    return x >= 0 && y >= 0 ? { x, y } : undefined;
}

function setSelectionToSegment(
    segment: ContentModelSegment,
    isInSelection: boolean,
    segmentsToDelete: number[],
    start: Selectable | null,
    end: Selectable | null,
    i: number
) {
    switch (segment.segmentType) {
        case 'SelectionMarker':
            if (!isInSelection || (segment != start && segment != end)) {
                // Delete the selection marker when
                // 1. It is not in selection any more. Or
                // 2. It is in middle of selection, so no need to have it
                segmentsToDelete.push(i);
            }
            return isInSelection;

        case 'General':
            setIsSelected(segment, isInSelection);

            return segment != start && segment != end
                ? setSelectionToBlockGroup(segment, isInSelection, start, end)
                : isInSelection;

        case 'Image':
            setIsSelected(segment, isInSelection);
            segment.isSelectedAsImageSelection = start == segment && (!end || end == segment);
            return isInSelection;
        default:
            setIsSelected(segment, isInSelection);
            return isInSelection;
    }
}

function setIsSelected(selectable: Selectable, value: boolean) {
    if (value) {
        selectable.isSelected = true;
    } else {
        delete selectable.isSelected;
    }

    return value;
}

function handleSelection(
    isInSelection: boolean,
    model: ContentModelBlockGroup | ContentModelBlock | ContentModelSegment,
    start: Selectable | null,
    end: Selectable | null,
    callback: (isInSelection: boolean) => boolean
) {
    isInSelection = isInSelection || model == start;
    isInSelection = callback(isInSelection);
    return isInSelection && !!end && model != end;
}
