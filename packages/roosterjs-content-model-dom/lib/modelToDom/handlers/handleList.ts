import { applyFormat } from '../utils/applyFormat';
import { applyMetadata } from '../utils/applyMetadata';
import { cleanUpRestNodes } from '../utils/cleanUpRestNodes';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import type {
    ContentModelBlockHandler,
    ContentModelListItem,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleList: ContentModelBlockHandler<ContentModelListItem> = (
    doc: Document,
    parent: Node,
    listItem: ContentModelListItem,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    let layer = 0;
    const { nodeStack } = context.listFormat;

    if (nodeStack.length == 0) {
        nodeStack.push({
            node: parent,
            refNode,
        });
    }

    // Skip existing list levels that has same properties so we can reuse them
    for (; layer < listItem.levels.length && layer + 1 < nodeStack.length; layer++) {
        const parentLevel = nodeStack[layer];
        const stackLevel = nodeStack[layer + 1];
        const itemLevel = listItem.levels[layer];

        if (
            stackLevel.listType != itemLevel.listType ||
            stackLevel.dataset?.editingInfo != itemLevel.dataset.editingInfo ||
            (itemLevel.listType == 'OL' &&
                typeof itemLevel.format.startNumberOverride === 'number') ||
            (itemLevel.listType == 'UL' &&
                itemLevel.format.listStyleType != stackLevel.format?.listStyleType)
        ) {
            break;
        } else if (itemLevel.listType == 'UL') {
            // Apply metadata to list level to make sure list style is correct after rendering
            applyMetadata(itemLevel, context.metadataAppliers.listLevel, itemLevel.format, context);
        }

        if (
            context.allowCacheListItem &&
            parentLevel.refNode &&
            itemLevel.cachedElement == parentLevel.refNode
        ) {
            // Move refNode to next node since we are reusing this cached element
            parentLevel.refNode = parentLevel.refNode.nextSibling;
        }
    }

    // Cut off remained list levels that we can't reuse
    if (context.allowCacheListItem) {
        // Clean up all rest nodes in the reused list levels
        for (let i = layer + 1; i < nodeStack.length; i++) {
            const stackLevel = nodeStack[i];

            cleanUpRestNodes(stackLevel.refNode, context.rewriteFromModel);
        }
    }

    nodeStack.splice(layer + 1);

    // Create new list levels that are after reused ones
    for (; layer < listItem.levels.length; layer++) {
        const level = listItem.levels[layer];
        const lastParent = nodeStack[nodeStack.length - 1].node;

        let newList: HTMLOListElement | HTMLUListElement;
        let isNewlyCreated = false;
        const levelRefNode = nodeStack[layer].refNode ?? null;

        if (context.allowCacheListItem && level.cachedElement) {
            newList = level.cachedElement;

            nodeStack[layer].refNode = reuseCachedElement(
                lastParent,
                level.cachedElement,
                levelRefNode,
                context.rewriteFromModel
            );
            nodeStack.push({
                node: newList,
                refNode: newList.firstChild,
                listType: level.listType,
                format: { ...level.format },
                dataset: { ...level.dataset },
            });
        } else {
            newList = doc.createElement(level.listType == 'OL' ? 'ol' : 'ul');
            isNewlyCreated = true;

            lastParent.insertBefore(newList, levelRefNode);
            nodeStack.push({
                node: newList,
                refNode: null,
                listType: level.listType,
                format: { ...level.format },
                dataset: { ...level.dataset },
            });

            if (context.allowCacheListItem) {
                level.cachedElement = newList;
            }
        }

        applyFormat(newList, context.formatAppliers.listLevelThread, level.format, context);

        // Need to apply metadata after applying list level format since the list numbers value relies on the result of list thread handling
        applyMetadata(level, context.metadataAppliers.listLevel, level.format, context);

        // Need to apply listItemElement formats after applying metadata since the list numbers value relies on the result of metadata handling
        applyFormat(newList, context.formatAppliers.listLevel, level.format, context);
        applyFormat(newList, context.formatAppliers.dataset, level.dataset, context);

        if (isNewlyCreated) {
            context.onNodeCreated?.(level, newList);
        }
    }

    return nodeStack[0].refNode;
};
