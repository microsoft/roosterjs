import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import type { ContentModelSegmentHandler, ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleText: ContentModelSegmentHandler<ContentModelText> = (
    doc,
    parent,
    segment,
    context,
    segmentNodes
) => {
    const txt = doc.createTextNode(segment.text);
    const element = doc.createElement('span');

    parent.appendChild(element);
    element.appendChild(txt);

    handleSegmentCommon(doc, txt, element, segment, context, segmentNodes);
};
