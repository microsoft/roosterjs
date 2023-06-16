import { ContentModelBr } from '../../publicTypes/segment/ContentModelBr';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleBr: ContentModelHandler<ContentModelBr> = (
    doc: Document,
    parent: Node,
    segment: ContentModelBr,
    context: ModelToDomContext
) => {
    const br = doc.createElement('br');
    const element = doc.createElement('span');
    element.appendChild(br);
    parent.appendChild(element);

    handleSegmentCommon(doc, br, element, segment, context);
};
