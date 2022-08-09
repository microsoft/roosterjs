import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
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
    let element: HTMLElement | null = null;

    switch (segment.segmentType) {
        case ContentModelSegmentType.Text:
            const txt = doc.createTextNode(segment.text);

            element = doc.createElement('span');
            element.appendChild(txt);
            break;

        case ContentModelSegmentType.Br:
            element = doc.createElement('br');
            break;

        case ContentModelSegmentType.General:
            handleBlock(doc, parent, segment, context);
            break;
    }

    if (element) {
        parent.appendChild(element);
    }
}
