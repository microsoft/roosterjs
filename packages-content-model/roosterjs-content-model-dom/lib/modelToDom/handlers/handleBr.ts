import { ContentModelBr, ContentModelSegmentHandler } from 'roosterjs-content-model-types';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';

/**
 * @internal
 */
export const handleBr: ContentModelSegmentHandler<ContentModelBr> = (
    doc,
    parent,
    segment,
    context,
    segmentNodes
) => {
    const br = doc.createElement('br');
    const element = doc.createElement('span');
    element.appendChild(br);
    parent.appendChild(element);

    handleSegmentCommon(doc, br, element, segment, context, segmentNodes);
};
