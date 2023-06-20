import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import {
    ContentModelHandler,
    ContentModelText,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleText: ContentModelHandler<ContentModelText> = (
    doc: Document,
    parent: Node,
    segment: ContentModelText,
    context: ModelToDomContext
) => {
    const txt = doc.createTextNode(segment.text);
    const element = doc.createElement('span');

    parent.appendChild(element);
    element.appendChild(txt);

    handleSegmentCommon(doc, txt, element, segment, context);
};
