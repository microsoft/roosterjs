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

    context.formatAppliers.text.forEach(applier => applier(segment.format, txt, context));
    context.textContext = { lastSegment: segment, lastTextNode: txt };

    handleSegmentCommon(doc, txt, element, segment, context, segmentNodes);
};
