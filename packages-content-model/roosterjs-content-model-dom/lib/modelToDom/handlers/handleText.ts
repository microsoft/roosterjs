import { ContentModelSegmentHandler, ContentModelText } from 'roosterjs-content-model-types';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';

/**
 * @internal
 */
export const handleText: ContentModelSegmentHandler<ContentModelText> = (
    doc,
    parent,
    segment,
    context,
    paragraph,
    newNodes
) => {
    const txt = doc.createTextNode(segment.text);
    const element = doc.createElement('span');

    parent.appendChild(element);
    element.appendChild(txt);

    handleSegmentCommon(doc, txt, element, segment, context, paragraph, newNodes);
};
