import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { handleBlock } from './handleBlock';

/**
 * @internal
 */
export function handleSegment(doc: Document, parent: Node, segment: ContentModelSegment) {
    let element: HTMLElement | null = null;

    switch (segment.segmentType) {
        case ContentModelSegmentType.Text:
            const txt = doc.createTextNode(segment.text);

            element = doc.createElement('span');
            element.appendChild(txt);
            break;

        case ContentModelSegmentType.General:
            handleBlock(doc, parent, segment);
            break;
    }

    if (element) {
        parent.appendChild(element);
    }
}
