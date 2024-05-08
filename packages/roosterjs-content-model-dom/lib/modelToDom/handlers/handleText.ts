import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import type {
    ContentModelSegmentHandler,
    ReadonlyContentModelText,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleText: ContentModelSegmentHandler<ReadonlyContentModelText> = (
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

    handleSegmentCommon(doc, txt, element, segment, context, segmentNodes);
};
