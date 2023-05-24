import { deleteSegment } from '../utils/deleteSegment';
import { EditStep } from '../utils/EditStep';

export const deleteAllSegmentBefore: EditStep = (context, options) => {
    const { onDeleteEntity } = options;
    const { paragraph, marker } = context.insertPoint;
    const index = paragraph.segments.indexOf(marker);

    for (let i = index - 1; i >= 0; i--) {
        const segment = paragraph.segments[i];

        segment.isSelected = true;
        context.isChanged = deleteSegment(paragraph, segment, onDeleteEntity) || context.isChanged;
    }
};
