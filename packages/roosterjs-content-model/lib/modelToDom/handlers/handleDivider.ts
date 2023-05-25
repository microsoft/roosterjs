import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { reuseCachedElement } from '../utils/reuseCachedElement';

/**
 * @internal
 */
export const handleDivider: ContentModelBlockHandler<ContentModelDivider> = (
    doc: Document,
    parent: Node,
    divider: ContentModelDivider,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    let element = divider.cachedElement;

    if (element) {
        refNode = reuseCachedElement(parent, element, refNode);
    } else {
        element = doc.createElement(divider.tagName);

        divider.cachedElement = element;
        parent.insertBefore(element, refNode);

        applyFormat(element, context.formatAppliers.divider, divider.format, context);

        if (divider.size) {
            element.setAttribute('size', divider.size);
        }
    }

    context.onNodeCreated?.(divider, element);

    return refNode;
};
