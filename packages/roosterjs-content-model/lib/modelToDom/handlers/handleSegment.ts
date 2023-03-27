import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleSegment: ContentModelHandler<ContentModelSegment> = (
    doc: Document,
    parent: Node,
    segment: ContentModelSegment,
    context: ModelToDomContext
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
            context.modelHandlers.text(doc, parent, segment, context);
            break;

        case 'Br':
            context.modelHandlers.br(doc, parent, segment, context);
            break;

        case 'Image':
            context.modelHandlers.image(doc, parent, segment, context);
            break;

        case 'General':
            context.modelHandlers.general(doc, parent, segment, context, null /*refNode*/);
            break;

        case 'Entity':
            context.modelHandlers.entity(doc, parent, segment, context, null /*refNode*/);
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
