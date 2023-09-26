import { DeleteResult } from '../utils/DeleteSelectionStep';
import { deleteSegment } from '../utils/deleteSegment';
import type { DeleteSelectionStep } from '../utils/DeleteSelectionStep';

/**
 * @internal
 */
export const deleteAllSegmentBefore: DeleteSelectionStep = context => {
    const { paragraph, marker } = context.insertPoint;
    const index = paragraph.segments.indexOf(marker);

    for (let i = index - 1; i >= 0; i--) {
        const segment = paragraph.segments[i];

        segment.isSelected = true;

        if (deleteSegment(paragraph, segment, context.formatContext)) {
            context.deleteResult = DeleteResult.Range;
        }
    }
};
