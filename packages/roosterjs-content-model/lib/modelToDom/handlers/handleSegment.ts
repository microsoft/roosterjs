import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { FormatContext } from '../../publicTypes/format/FormatContext';
import { handleBlock } from './handleBlock';

/**
 * @internal
 */
export function handleSegment(
    doc: Document,
    parent: Node,
    segment: ContentModelSegment,
    context: FormatContext
) {
    let element: HTMLElement | null = null;

    switch (segment.segmentType) {
        case ContentModelSegmentType.Text:
            const txt = doc.createTextNode(segment.text);

            element = doc.createElement('span');
            element.appendChild(txt);
            break;

        case ContentModelSegmentType.General:
            handleBlock(doc, parent, segment, context);
            break;
    }

    if (element) {
        parent.appendChild(element);
    }
}
