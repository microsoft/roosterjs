import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { createBlockFromContentModel } from './createBlockFromContentModel';

/**
 * @internal
 */
export function createSegmentFromContent(
    doc: Document,
    parent: Node,
    segment: ContentModelSegment
) {
    let element: HTMLElement | null = null;

    switch (segment.segmentType) {
        case ContentModelSegmentType.Text:
            const txt = doc.createTextNode(segment.text);

            element = doc.createElement('span');
            element.appendChild(txt);
            break;

        case ContentModelSegmentType.General:
            createBlockFromContentModel(doc, parent, segment);
            break;
    }

    if (element) {
        parent.appendChild(element);
    }
}
