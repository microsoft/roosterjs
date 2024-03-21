import { deleteSegment } from 'roosterjs-content-model-dom';
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

    for (let i = index - 1; i >= 0; i--) {
        const segment = paragraph.segments[i];

        segment.isSelected = true;

        if (deleteSegment(paragraph, segment, context.formatContext)) {
            context.deleteResult = 'range';
        }
    }
};
