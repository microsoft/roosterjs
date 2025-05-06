import type {
    ContentModelBlockGroupBase,
    ContentModelBlockGroupType,
    ContentModelParagraph,
    ContentModelSegment,
    ContentModelTableCell,
    ContentModelTableRow,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function pruneUnselectedModel(
    model: ContentModelBlockGroupBase<ContentModelBlockGroupType, HTMLElement>
) {
    pruneUnselectedModelInternal(model, false /* isSelectionAfterElement */);

    unwrap(model);
}

function pruneUnselectedModelInternal(
    model: ContentModelBlockGroupBase<ContentModelBlockGroupType, HTMLElement>,
    isSelectionAfterElement: boolean
) {
    for (let index = model.blocks.length - 1; index >= 0; index--) {
        const block = model.blocks[index];

        switch (block.blockType) {
            case 'BlockGroup':
                pruneUnselectedModelInternal(block, isSelectionAfterElement);
                if (
                    block.blockGroupType == 'General'
                        ? block.blocks.length == 0 && !block.isSelected
                        : block.blocks.length == 0
                ) {
                    model.blocks.splice(index, 1);
                }
                break;
            case 'Divider':
            case 'Entity':
                if (!block.isSelected) {
                    model.blocks.splice(index, 1);
                } else {
                    isSelectionAfterElement = true;
                }
                break;
            case 'Paragraph':
                const newSegments: ContentModelSegment[] = [];
                for (const segment of block.segments) {
                    if (segment.segmentType == 'General') {
                        pruneUnselectedModel(segment);
                        if (segment.blocks.length > 0 || segment.isSelected) {
                            newSegments.push(segment);
                        }
                    } else if (segment.isSelected && segment.segmentType != 'SelectionMarker') {
                        newSegments.push(segment);
                    }
                }
                block.segments = newSegments;
                if (block.segments.length == 0) {
                    model.blocks.splice(index, 1);
                } else {
                    isSelectionAfterElement = true;
                }
                break;
            case 'Table':
                const filteredRows: ContentModelTableRow[] = [];
                for (let i = 0; i < block.rows.length; i++) {
                    const row = block.rows[i];
                    for (let j = 0; j < row.cells.length; j++) {
                        const cell = row.cells[j];
                        if (!cell.isSelected) {
                            pruneUnselectedModelInternal(cell, isSelectionAfterElement);
                        } else {
                            isSelectionAfterElement = true;
                        }
                    }

                    const newCells: ContentModelTableCell[] = [];
                    for (let k = 0; k < row.cells.length; k++) {
                        const cell = row.cells[k];
                        if (cell.isSelected || cell.blocks.length > 0) {
                            newCells.push(cell);
                        }
                    }
                    row.cells = newCells;

                    if (row.cells.length > 0) {
                        filteredRows.push(row);
                    }
                }

                if (
                    !isSelectionAfterElement &&
                    filteredRows.length == 1 &&
                    filteredRows[0].cells.length == 1 &&
                    !filteredRows[0].cells[0].isSelected
                ) {
                    const cell = filteredRows[0].cells[0];
                    model.blocks.splice(index, 1, ...cell.blocks);
                } else if (filteredRows.length == 0) {
                    model.blocks.splice(index, 1);
                } else {
                    block.rows = filteredRows;
                }
                break;
        }
    }
    return isSelectionAfterElement;
}

function unwrap(model: ContentModelBlockGroupBase<ContentModelBlockGroupType, HTMLElement>) {
    let block = model.blocks[0];
    if (model.blocks.length == 1) {
        while (block.blockType == 'BlockGroup') {
            model.blocks = block.blocks;
            block = model.blocks[0];

            if (model.blocks.length > 1) {
                return;
            }
        }

        if (block.blockType == 'Paragraph') {
            block.isImplicit = true;
            block.format = {};
            inheritSegmentFormatToChildren(block);
        }
    }
}

function inheritSegmentFormatToChildren(parent: ContentModelParagraph) {
    const value = parent.segmentFormat;
    if (value !== undefined) {
        for (let index = 0; index < parent.segments.length; index++) {
            const segment = parent.segments[index];
            segment.format = {
                ...parent.segmentFormat,
                ...segment.format,
            };
        }
    }
}
