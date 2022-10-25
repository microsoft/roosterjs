import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelListItem } from '../../publicTypes/block/group/ContentModelListItem';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleList: ContentModelHandler<ContentModelListItem> = (
    doc: Document,
    parent: Node,
    listItem: ContentModelListItem,
    context: ModelToDomContext
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

        lastParent.appendChild(newList);
        applyFormat(newList, context.formatAppliers.listLevel, level, context);

        nodeStack.push({ node: newList, ...level });
    }
};
