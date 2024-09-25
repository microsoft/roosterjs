import { areSameFormats } from '../../domToModel/utils/areSameFormats';
import type {
    ContentModelCode,
    ContentModelLink,
    ContentModelSegment,
    ContentModelSegmentHandler,
    ContentModelText,
    ModelToDomTextContext,
    ModelToDomTextContextItem,
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
            let txtToReuse: Text | null = tryReuseTextNode(context.textContext, segment);

            if (txtToReuse) {
                txtToReuse.nodeValue += segment.text;
                // Handle selection
                // Update index
            } else {
                context.modelHandlers.text(doc, parent, segment, context, segmentNodes);
            }
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

    if (segment.segmentType != 'Text') {
        delete context.textContext;
    }

    // If end position is not set, or it is not finalized, and current segment is still in selection, set end position
    // If there is other selection, we will overwrite regularSelection.end when we process that segment
    if (segment.isSelected && regularSelection.start) {
        regularSelection.end = {
            ...regularSelection.current,
        };
    }
};

function tryReuseTextNode(
    textContext: ModelToDomTextContextItem | undefined,
    segment: ContentModelText
): Text | null {
    if (!textContext) {
        return null;
    }

    const { lastSegment, lastTextNode } = textContext;

    return !areSameFormats(lastSegment.format, segment.format) ||
        !areSameLinks(lastSegment.link, segment.link) ||
        !areSameCodes(lastSegment.code, segment.code)
        ? null
        : lastTextNode;
}

function areSameLinks(
    link1: ContentModelLink | undefined,
    link2: ContentModelLink | undefined
): boolean {
    if (link1 && link2) {
        return (
            areSameFormats(link1.format, link2.format) &&
            areSameFormats(link1.dataset, link2.dataset)
        );
    } else {
        return !(link1 || link2);
    }
}

function areSameCodes(
    code1: ContentModelCode | undefined,
    code2: ContentModelCode | undefined
): boolean {
    if (code1 && code2) {
        return areSameFormats(code1.format, code2.format);
    } else {
        return !(code1 || code2);
    }
}
