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
    const element = doc.createElement(segment.link ? 'a' : 'span');

    element.appendChild(txt);
    parent.appendChild(element);

    context.regularSelection.current.segment = txt;
    applyFormat(element, context.formatAppliers.segment, segment.format, context);

    if (segment.link) {
        applyFormat(element, context.formatAppliers.link, segment.link, context);
    }
};
