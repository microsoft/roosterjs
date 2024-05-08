import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import type {
    ContentModelSegmentHandler,
    ReadonlyContentModelBr,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleBr: ContentModelSegmentHandler<ReadonlyContentModelBr> = (
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
