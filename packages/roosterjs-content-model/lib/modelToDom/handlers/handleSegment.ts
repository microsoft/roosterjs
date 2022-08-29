import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { handleBlock } from './handleBlock';
import { ModelToDomContext } from '../context/ModelToDomContext';

/**
 * @internal
 */
export function handleSegment(
    doc: Document,
    parent: Node,
    segment: ContentModelSegment,
    context: ModelToDomContext
) {
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
            break;

        case 'Br':
            element = doc.createElement('br');
            regularSelection.current.segment = element;
            break;

        case 'General':
            regularSelection.current.segment = segment.element;

            handleBlock(doc, parent, segment, context);
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
}
