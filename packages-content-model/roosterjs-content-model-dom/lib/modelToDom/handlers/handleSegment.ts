import {
    ContentModelSegment,
    ContentModelSegmentHandler,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleSegment: ContentModelSegmentHandler<ContentModelSegment> = (
    doc: Document,
    parent: Node,
    segment: ContentModelSegment,
    context: ModelToDomContext,
    paragraph
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
            context.modelHandlers.text(doc, parent, segment, context, paragraph);
            break;

        case 'Br':
            context.modelHandlers.br(doc, parent, segment, context, paragraph);
            break;

        case 'Image':
            context.modelHandlers.image(doc, parent, segment, context, paragraph);
            break;

        case 'General':
            context.modelHandlers.general(
                doc,
                parent,
                segment,
                context,
                paragraph,
                null /*refNode*/
            );
            break;

        case 'Entity':
            context.modelHandlers.entity(
                doc,
                parent,
                segment,
                context,
                paragraph,
                null /*refNode*/
            );
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
