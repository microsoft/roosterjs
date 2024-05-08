import { applyFormat } from '../utils/applyFormat';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import type {
    ContentModelBlockHandler,
    ReadonlyContentModelDivider,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleDivider: ContentModelBlockHandler<ReadonlyContentModelDivider> = (
    doc,
    parent,
    divider,
    context,
    refNode
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

    context.onNodeCreated?.(divider, element);

    return refNode;
};
