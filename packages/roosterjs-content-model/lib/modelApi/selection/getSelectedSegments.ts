import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';

/**
 * @internal
 * Get all selected segments to do formatting
 * @param model The root of a Content Model
 * @returns An array of selected segments
 */
export default function getSelectedSegments(
    model: ContentModelDocument,
    includingFormatHolder?: boolean
): ContentModelSegment[] {
    const segments: ContentModelSegment[] = [];

    getSelectedSegmentsFromBlockGroup(model, segments, includingFormatHolder);

    return segments;
}

function getSelectedSegmentsFromBlockGroup(
    group: ContentModelBlockGroup,
    result: ContentModelSegment[],
    includingFormatHolder?: boolean,
    treatAllSegmentsAsSelected?: boolean
) {
    if (
        includingFormatHolder &&
        group.blockGroupType == 'ListItem' &&
        group.blocks.every(
            block =>
                block.blockType === 'Paragraph' &&
                block.segments.every(segment => segment.isSelected)
        )
    ) {
        result.push(group.formatHolder);
    }

    group.blocks.forEach(childBlock => {
        getSelectedSegmentsFromBlock(
            childBlock,
            result,
            includingFormatHolder,
            treatAllSegmentsAsSelected
        );
    });
}

function getSelectedSegmentsFromBlock(
    block: ContentModelBlock,
    result: ContentModelSegment[],
    includingFormatHolder?: boolean,
    treatAllSegmentsAsSelected?: boolean
) {
    switch (block.blockType) {
        case 'BlockGroup':
            getSelectedSegmentsFromBlockGroup(
                block,
                result,
                includingFormatHolder,
                treatAllSegmentsAsSelected
            );
            break;

        case 'Table':
            block.cells.forEach(cells => {
                cells.forEach(cell =>
                    getSelectedSegmentsFromBlockGroup(
                        cell,
                        result,
                        includingFormatHolder,
                        treatAllSegmentsAsSelected || !!cell.isSelected
                    )
                );
            });
            break;

        case 'Paragraph':
            block.segments.forEach(segment => {
                if (treatAllSegmentsAsSelected || segment.isSelected) {
                    result.push(segment);
                }
            });

            break;
    }
}
