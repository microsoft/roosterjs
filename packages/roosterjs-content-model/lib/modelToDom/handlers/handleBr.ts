import { applyFormat } from '../utils/applyFormat';
import { ContentModelBr } from '../../publicTypes/segment/ContentModelBr';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
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

    context.regularSelection.current.segment = br;
    applyFormat(element, context.formatAppliers.segment, segment.format, context);

    context.modelHandlers.segmentDecorator(doc, br, segment, context);
};
