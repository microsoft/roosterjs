import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import type { ContentModelSegmentHandler, ContentModelText } from 'roosterjs-content-model-types';

const nonBreakingSpace = '\u00A0';

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
    const textContent =
        context.noFollowingTextSegmentOrLast && segment.text.endsWith(' ')
            ? segment.text.slice(0, -1) + nonBreakingSpace
            : segment.text;
    const txt = doc.createTextNode(textContent);
    const element = doc.createElement('span');

    parent.appendChild(element);
    element.appendChild(txt);

    context.formatAppliers.text.forEach(applier => applier(segment.format, txt, context));

    handleSegmentCommon(doc, txt, element, segment, context, segmentNodes);
};
