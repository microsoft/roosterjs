import { applyFormat } from '../utils/applyFormat';
import { applyMetadata } from '../utils/applyMetadata';
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
        });
    }

    // Skip existing list levels that has same properties so we can reuse them
    for (; layer < listItem.levels.length && layer + 1 < nodeStack.length; layer++) {
        const stackLevel = nodeStack[layer + 1];
        const itemLevel = listItem.levels[layer];

        if (
            stackLevel.listType != itemLevel.listType ||
            stackLevel.dataset?.editingInfo != itemLevel.dataset.editingInfo ||
            (itemLevel.listType == 'OL' && typeof itemLevel.format.startNumberOverride === 'number')
        ) {
            break;
        }
    }

    // Cut off remained list levels that we can't reuse
    nodeStack.splice(layer + 1);

    // Create new list levels that are after reused ones
    for (; layer < listItem.levels.length; layer++) {
        const level = listItem.levels[layer];
        const newList = doc.createElement(level.listType || 'UL');
        const lastParent = nodeStack[nodeStack.length - 1].node;

        lastParent.insertBefore(newList, layer == 0 ? refNode : null);
        nodeStack.push({ node: newList, ...level });

        applyFormat(newList, context.formatAppliers.listLevelThread, level.format, context);

        // Need to apply metadata after applying list level format since the list numbers value relies on the result of list thread handling
        applyMetadata(level, context.metadataAppliers.listLevel, level.format, context);

        // Need to apply listItemElement formats after applying metadata since the list numbers value relies on the result of metadata handling
        applyFormat(newList, context.formatAppliers.listLevel, level.format, context);
        applyFormat(newList, context.formatAppliers.dataset, level.dataset, context);

        context.onNodeCreated?.(level, newList);
    }

    return refNode;
};
