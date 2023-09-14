import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler, ContentModelDivider } from 'roosterjs-content-model-types';
import { reuseCachedElement } from '../utils/reuseCachedElement';

/**
 * @internal
 */
export const handleDivider: ContentModelBlockHandler<ContentModelDivider> = (
    doc,
    parent,
    divider,
    context,
    refNode,
    onNodeCreated
) => {
    let element = context.allowCacheElement ? divider.cachedElement : undefined;

    if (element) {
        refNode = reuseCachedElement(parent, element, refNode);
    } else {
        element = doc.createElement(divider.tagName);

        if (context.allowCacheElement) {
            divider.cachedElement = element;
        }

        parent.insertBefore(element, refNode);

        applyFormat(element, context.formatAppliers.divider, divider.format, context);

        if (divider.size) {
            element.setAttribute('size', divider.size);
        }
    }

    onNodeCreated?.(divider, element);

    return refNode;
};
