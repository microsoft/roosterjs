import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import type { ContentModelBr, ContentModelSegmentHandler } from 'roosterjs-content-model-types';

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
    if (segment.format.clear) {
        br.style.clear = segment.format.clear;
    }

    const element = doc.createElement('span');
    element.appendChild(br);
    parent.appendChild(element);

    handleSegmentCommon(doc, br, element, segment, context, segmentNodes);
};
