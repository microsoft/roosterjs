import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler, ContentModelListItem } from 'roosterjs-content-model-types';
import { listLevelMetadataFormatHandler } from '../../formatHandlers/list/listLevelMetadataFormatHandler';
import { updateListMetadata } from '../../domUtils/metadata/updateListMetadata';

/**
 * @internal
 */
export const handleList: ContentModelBlockHandler<ContentModelListItem> = (
    doc,
    parent,
    listItem,
    context,
    refNode,
    onNodeCreated
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

        applyFormat(newList, context.formatAppliers.listLevel, level.format, context);

        // TODO: Move this out into roosterjs-content-model-editor package
        updateListMetadata(level, metadata => {
            applyFormat(newList, [listLevelMetadataFormatHandler.apply], metadata || {}, context);

            if (
                metadata &&
                typeof metadata.orderedStyleType == 'undefined' &&
                typeof metadata.unorderedStyleType == 'undefined'
            ) {
                metadata = null;
            }

            return metadata;
        });
        applyFormat(newList, context.formatAppliers.dataset, level.dataset, context);

        nodeStack.push({ node: newList, ...level });

        onNodeCreated?.(level, newList);
    }

    return refNode;
};
