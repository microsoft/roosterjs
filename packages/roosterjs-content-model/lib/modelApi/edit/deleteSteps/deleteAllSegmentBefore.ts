import { deleteSegment } from '../utils/deleteSegment';
import { DeleteSelectionStep } from '../utils/DeleteSelectionStep';

/**
 * @internal
 */
export const deleteAllSegmentBefore: DeleteSelectionStep = (context, onDeleteEntity) => {
    const { paragraph, marker } = context.insertPoint;
    const index = paragraph.segments.indexOf(marker);

    for (let i = index - 1; i >= 0; i--) {
        const segment = paragraph.segments[i];

        segment.isSelected = true;
        context.isChanged = deleteSegment(paragraph, segment, onDeleteEntity) || context.isChanged;
    }
};
