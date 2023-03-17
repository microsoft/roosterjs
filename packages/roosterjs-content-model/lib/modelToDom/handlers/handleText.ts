import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

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

    context.regularSelection.current.segment = txt;

    applyFormat(element, context.formatAppliers.segment, segment.format, context);

    context.modelHandlers.segmentDecorator(doc, txt, segment, context);
};
