import { DeleteResult, DeleteSelectionStep } from '../utils/DeleteSelectionStep';
import { deleteSegment } from '../utils/deleteSegment';

/**
 * @internal
 */
export const deleteAllSegmentBefore: DeleteSelectionStep = (context, onDeleteEntity) => {
    const { paragraph, marker } = context.insertPoint;
    const index = paragraph.segments.indexOf(marker);

    for (let i = index - 1; i >= 0; i--) {
        const segment = paragraph.segments[i];

        segment.isSelected = true;

        if (deleteSegment(paragraph, segment, onDeleteEntity)) {
            context.deleteResult = DeleteResult.Range;
        }
    }
};
