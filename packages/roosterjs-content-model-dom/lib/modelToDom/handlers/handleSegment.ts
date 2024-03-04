import type {
    ContentModelSegment,
    ContentModelSegmentHandler,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleSegment: ContentModelSegmentHandler<ContentModelSegment> = (
    doc,
    parent,
    segment,
    context,
    segmentNodes
) => {
    const regularSelection = context.regularSelection;

    // If start position is not set yet, and current segment is in selection, set start position
    if (segment.isSelected && !regularSelection.start) {
        regularSelection.start = {
            ...regularSelection.current,
        };
    }

    switch (segment.segmentType) {
        case 'Text':
            context.modelHandlers.text(doc, parent, segment, context, segmentNodes);
            break;

        case 'Br':
            context.modelHandlers.br(doc, parent, segment, context, segmentNodes);
            break;

        case 'Image':
            context.modelHandlers.image(doc, parent, segment, context, segmentNodes);
            break;

        case 'General':
            context.modelHandlers.generalSegment(doc, parent, segment, context, segmentNodes);
            break;

        case 'Entity':
            context.modelHandlers.entitySegment(doc, parent, segment, context, segmentNodes);
            break;
    }

    // If end position is not set, or it is not finalized, and current segment is still in selection, set end position
    // If there is other selection, we will overwrite regularSelection.end when we process that segment
    if (segment.isSelected && regularSelection.start) {
        regularSelection.end = {
            ...regularSelection.current,
        };
    }
};
