import { applyFormat } from '../utils/applyFormat';
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

    let element: HTMLElement | null = null;

    switch (segment.segmentType) {
        case 'Text':
            const txt = doc.createTextNode(segment.text);

            element = doc.createElement('span');
            element.appendChild(txt);
            regularSelection.current.segment = txt;

            applyFormat(element, context.formatAppliers.segment, segment.format, context);

            break;

        case 'Br':
            element = doc.createElement('br');
            regularSelection.current.segment = element;
            break;

        case 'Image':
            const img = doc.createElement('img');
            img.src = segment.src;

            element = img;
            applyFormat(element, context.formatAppliers.segment, segment.format, context);

            regularSelection.current.segment = element;

            if (segment.isSelectedAsImageSelection) {
                context.imageSelection = {
                    image: img,
                };
            }

            break;

        case 'General':
            context.modelHandlers.block(doc, parent, segment, context);
            break;

        case 'Entity':
            context.modelHandlers.entity(doc, parent, segment, context);
            break;
    }

    if (element) {
        parent.appendChild(element);
    }

    // If end position is not set, or it is not finalized, and current segment is still in selection, set end position
    // If there is other selection, we will overwrite regularSelection.end when we process that segment
    if (segment.isSelected && regularSelection.start) {
        regularSelection.end = {
            ...regularSelection.current,
        };
    }
};
