import { applyFormat } from '../utils/applyFormat';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { DatasetFormat } from '../../publicTypes/format/formatParts/DatasetFormat';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { updateListMetadata } from '../../domUtils/metadata/updateListMetadata';

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
            stackLevel.orderedStyleType != itemLevel.orderedStyleType ||
            stackLevel.unorderedStyleType != itemLevel.unorderedStyleType ||
            (itemLevel.listType == 'OL' && typeof itemLevel.startNumberOverride === 'number')
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

        applyFormat(newList, context.formatAppliers.listLevel, level, context);

        handleMetadata(level, newList, context);

        nodeStack.push({ node: newList, ...level });

        context.onNodeCreated?.(level, newList);
    }

    return refNode;
};

function handleMetadata(
    level: ContentModelListItemLevelFormat,
    newList: HTMLElement,
    context: ModelToDomContext
) {
    const dataset: DatasetFormat = {};

    updateListMetadata({ dataset }, () =>
        typeof level.orderedStyleType === 'number' || typeof level.unorderedStyleType === 'number'
            ? {
                  orderedStyleType: level.orderedStyleType,
                  unorderedStyleType: level.unorderedStyleType,
              }
            : null
    );
    applyFormat(newList, context.formatAppliers.dataset, dataset, context);
}
