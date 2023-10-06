import { isGeneralSegment } from 'roosterjs-content-model-dom';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelSegment,
    ContentModelTable,
    Selectable,
} from 'roosterjs-content-model-types';

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
    const first = findCell(table, start);
    const last = end ? findCell(table, end) : first;

    if (!isInSelection) {
        for (let row = 0; row < table.rows.length; row++) {
            const currentRow = table.rows[row];
            for (let col = 0; col < currentRow.cells.length; col++) {
                const currentCell = table.rows[row].cells[col];
                const isSelected =
                    row >= first.row && row <= last.row && col >= first.col && col <= last.col;

                setIsSelected(currentCell, isSelected);

                if (!isSelected) {
                    setSelectionToBlockGroup(
                        currentCell,
                        false /*isInSelection*/,
                        null /*start*/,
                        null /*end*/
                    );
                }
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

function findCell(table: ContentModelTable, cell: Selectable | null): { row: number; col: number } {
    let col = -1;
    const row = cell
        ? table.rows.findIndex(row => (col = (row.cells as Selectable[]).indexOf(cell)) >= 0)
        : -1;

    return { row, col };
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
