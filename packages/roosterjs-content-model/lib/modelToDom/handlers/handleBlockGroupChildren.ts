import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelBlockWithCache } from '../../publicTypes/block/ContentModelBlockWithCache';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { getEntityFromElement } from 'roosterjs-editor-dom';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const handleBlockGroupChildren: ContentModelHandler<ContentModelBlockGroup> = (
    doc: Document,
    parent: Node,
    group: ContentModelBlockGroup,
    context: ModelToDomContext
) => {
    const { listFormat } = context;
    const nodeStack = listFormat.nodeStack;
    let refNode: Node | null = parent.firstChild;

    try {
        group.blocks.forEach((childBlock, index) => {
            // When process list, we need a node stack.
            // When there are two continuous lists, they should share the same stack
            // so that list items with same type/threadId can be merged into the same list element
            // In other cases, clear the stack so that two separate lists won't share the same list element
            if (
                index == 0 ||
                childBlock.blockType != 'BlockGroup' ||
                childBlock.blockGroupType != 'ListItem'
            ) {
                listFormat.nodeStack = [];
            }

            refNode = context.modelHandlers.block(doc, parent, childBlock, context, refNode);
        });

        // Remove all rest node if any since they don't appear in content model
        while (refNode) {
            const next = refNode.nextSibling;

            refNode.parentNode?.removeChild(refNode);
            refNode = next;
        }
    } finally {
        listFormat.nodeStack = nodeStack;
    }
};

function remove(node: Node) {
    const next = node.nextSibling;
    node.parentNode?.removeChild(node);

    return next;
}

function isEntity(node: Node) {
    return isNodeOfType(node, NodeType.Element) && !!getEntityFromElement(node);
}

function getCachedElement(block: ContentModelBlock): HTMLElement | undefined {
    if ((block as ContentModelBlockWithCache).cachedElement) {
        return (block as ContentModelBlockWithCache).cachedElement;
    } else if (block.blockType == 'Entity') {
        return block.wrapper;
    } else if (block.blockType == 'BlockGroup' && block.blockGroupType == 'General') {
        return block.element;
    } else {
        return undefined;
    }
}
