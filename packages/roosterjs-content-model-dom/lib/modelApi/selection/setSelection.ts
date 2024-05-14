import { isGeneralSegment } from '../typeCheck/isGeneralSegment';
import { mutateBlock, mutateSegment } from '../common/mutateBlock';
import type {
    MutableType,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelParagraph,
    ReadonlyContentModelSegment,
    ReadonlyContentModelTable,
    ReadonlySelectable,
    Selectable,
    TableCellCoordinate,
} from 'roosterjs-content-model-types';

/**
 * Set selection into Content Model. If the Content Model already has selection, existing selection will be overwritten by the new one.
 * @param group The root level group of Content Model
 * @param start The start selected element. If not passed, existing selection of content model will be cleared
 * @param end The end selected element. If not passed, only the start element will be selected. If passed, all elements between start and end elements will be selected
 */
export function setSelection(
    group: ReadonlyContentModelBlockGroup,
    start?: ReadonlySelectable,
    end?: ReadonlySelectable
) {
    setSelectionToBlockGroup(group, false /*isInSelection*/, start || null, end || null);
}

function setSelectionToBlockGroup(
    group: ReadonlyContentModelBlockGroup,
    isInSelection: boolean,
    start: ReadonlySelectable | null,
    end: ReadonlySelectable | null
): boolean {
    return handleSelection(isInSelection, group, start, end, isInSelection => {
        if (isGeneralSegment(group) && needToSetSelection(group, isInSelection)) {
            setIsSelected(mutateBlock(group), isInSelection);
        }

        group.blocks.forEach(block => {
            isInSelection = setSelectionToBlock(block, isInSelection, start, end);
        });

        return isInSelection;
    });
}

function setSelectionToBlock(
    block: ReadonlyContentModelBlock,
    isInSelection: boolean,
    start: ReadonlySelectable | null,
    end: ReadonlySelectable | null
) {
    switch (block.blockType) {
        case 'BlockGroup':
            return setSelectionToBlockGroup(block, isInSelection, start, end);

        case 'Table':
            return setSelectionToTable(block, isInSelection, start, end);

        case 'Divider':
        case 'Entity':
            return handleSelection(isInSelection, block, start, end, isInSelection => {
                if (needToSetSelection(block, isInSelection)) {
                    const mutableBlock = mutateBlock(block);

                    if (isInSelection) {
                        mutableBlock.isSelected = true;
                    } else {
                        delete mutableBlock.isSelected;
                    }
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
                            block,
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

            let index: number | undefined;

            while ((index = segmentsToDelete.pop()) !== undefined) {
                if (index >= 0) {
                    mutateBlock(block).segments.splice(index, 1);
                }
            }

            return isInSelection;

        default:
            return isInSelection;
    }
}

function setSelectionToTable(
    table: ReadonlyContentModelTable,
    isInSelection: boolean,
    start: ReadonlySelectable | null,
    end: ReadonlySelectable | null
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

                if (needToSetSelection(currentCell, isSelected)) {
                    setIsSelected(mutateBlock(currentCell), isSelected);
                }

                if (!isSelected) {
                    setSelectionToBlockGroup(currentCell, false /*isInSelection*/, start, end);
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

function findCell(
    table: ReadonlyContentModelTable,
    cell: ReadonlySelectable | null
): TableCellCoordinate {
    let col = -1;
    const row = cell
        ? table.rows.findIndex(
              row => (col = (row.cells as ReadonlyArray<ReadonlySelectable>).indexOf(cell)) >= 0
          )
        : -1;

    return { row, col };
}

function setSelectionToSegment(
    paragraph: ReadonlyContentModelParagraph,
    segment: ReadonlyContentModelSegment,
    isInSelection: boolean,
    segmentsToDelete: number[],
    start: ReadonlySelectable | null,
    end: ReadonlySelectable | null,
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
            internalSetSelectionToSegment(paragraph, segment, isInSelection);

            return segment != start && segment != end
                ? setSelectionToBlockGroup(segment, isInSelection, start, end)
                : isInSelection;

        case 'Image':
            const isSelectedAsImageSelection = start == segment && (!end || end == segment);
            const mutableImage = internalSetSelectionToSegment(
                paragraph,
                segment,
                isInSelection,
                !segment.isSelectedAsImageSelection != !isSelectedAsImageSelection
            );

            if (mutableImage) {
                mutableImage.isSelectedAsImageSelection = isSelectedAsImageSelection;
            }

            return isInSelection;
        default:
            internalSetSelectionToSegment(paragraph, segment, isInSelection);
            return isInSelection;
    }
}

function internalSetSelectionToSegment<T extends ReadonlyContentModelSegment>(
    paragraph: ReadonlyContentModelParagraph,
    segment: T,
    isInSelection: boolean,
    force?: boolean
): MutableType<T> | null {
    if (force || needToSetSelection(segment, isInSelection)) {
        const [_, mutableSegment] = mutateSegment(paragraph, segment);

        if (mutableSegment) {
            setIsSelected(mutableSegment, isInSelection);

            return mutableSegment;
        }
    }

    return null;
}

function needToSetSelection(selectable: ReadonlySelectable, isSelected: boolean) {
    return !selectable.isSelected != !isSelected;
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
    model: ReadonlyContentModelBlockGroup | ReadonlyContentModelBlock | ReadonlyContentModelSegment,
    start: ReadonlySelectable | null,
    end: ReadonlySelectable | null,
    callback: (isInSelection: boolean) => boolean
) {
    isInSelection = isInSelection || model == start;
    isInSelection = callback(isInSelection);
    return isInSelection && !!end && model != end;
}
