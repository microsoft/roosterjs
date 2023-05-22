import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';

/**
 * @internal
 */
export const handleSelectionMarker: ContentModelHandler<ContentModelSelectionMarker> = (
    doc,
    parent,
    marker,
    context
) => {
    const txt = doc.createTextNode('');
    const element = doc.createElement('span');

    parent.appendChild(element);
    element.appendChild(txt);

    context.regularSelection.current.segment = txt;

    applyFormat(element, context.formatAppliers.segment, marker.format, context);

    context.modelHandlers.segmentDecorator(doc, element, marker, context);

    context.onNodeCreated?.(marker, txt);
};
