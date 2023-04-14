import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { isBlockGroupEmpty } from '../../modelApi/common/isEmpty';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const handleFormatContainer: ContentModelBlockHandler<ContentModelFormatContainer> = (
    doc: Document,
    parent: Node,
    container: ContentModelFormatContainer,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    let element = container.cachedElement;

    if (element) {
        refNode = reuseCachedElement(parent, element, refNode);

        context.modelHandlers.blockGroupChildren(doc, element, container, context);
    } else if (!isBlockGroupEmpty(container)) {
        element = doc.createElement(container.tagName);

        container.cachedElement = element;
        parent.insertBefore(element, refNode);

        stackFormat(context, container.tagName, () => {
            applyFormat(element!, context.formatAppliers.block, container.format, context);
            applyFormat(element!, context.formatAppliers.segmentOnBlock, container.format, context);
        });

        context.modelHandlers.blockGroupChildren(doc, element, container, context);
    }

    if (element) {
        context.onNodeCreated?.(container, element);
    }

    return refNode;
};
