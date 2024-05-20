import { deleteSegment, mutateBlock } from 'roosterjs-content-model-dom';
import type { DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteAllSegmentBefore: DeleteSelectionStep = context => {
    if (context.deleteResult != 'notDeleted') {
        return;
    }

    const { paragraph, marker } = context.insertPoint;
    const index = paragraph.segments.indexOf(marker);
    const mutableParagraph = mutateBlock(paragraph);

    for (let i = index - 1; i >= 0; i--) {
        const segment = mutableParagraph.segments[i];

        segment.isSelected = true;

        if (deleteSegment(paragraph, segment, context.formatContext)) {
            context.deleteResult = 'range';
        }
    }
};
