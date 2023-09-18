import { applyFormat } from '../utils/applyFormat';
import { isBlockGroupEmpty } from '../../modelApi/common/isEmpty';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { stackFormat } from '../utils/stackFormat';
import {
    ContentModelBlockFormat,
    ContentModelBlockHandler,
    ContentModelFormatContainer,
    ContentModelSegmentFormat,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

const PreChildFormat: ContentModelSegmentFormat & ContentModelBlockFormat = {
    fontFamily: 'monospace',
    whiteSpace: 'pre',
};

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
    let element = context.allowCacheElement ? container.cachedElement : undefined;

    if (element) {
        refNode = reuseCachedElement(parent, element, refNode);

        context.modelHandlers.blockGroupChildren(doc, element, container, context);
    } else if (!isBlockGroupEmpty(container)) {
        const containerNode = doc.createElement(container.tagName);

        if (context.allowCacheElement) {
            container.cachedElement = containerNode;
        }

        parent.insertBefore(containerNode, refNode);

        stackFormat(context, container.tagName, () => {
            applyFormat(containerNode, context.formatAppliers.container, container.format, context);
            applyFormat(
                containerNode,
                context.formatAppliers.segmentOnBlock,
                container.format,
                context
            );

            applyFormat(containerNode, context.formatAppliers.container, container.format, context);
        });

        if (container.tagName == 'pre') {
            stackFormat(context, PreChildFormat, () => {
                context.modelHandlers.blockGroupChildren(doc, containerNode, container, context);
            });
        } else {
            context.modelHandlers.blockGroupChildren(doc, containerNode, container, context);
        }

        element = containerNode;
    }

    if (element) {
        context.onNodeCreated?.(container, element);
    }

    return refNode;
};
