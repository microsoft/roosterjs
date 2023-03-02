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

            const element = getCachedElement(childBlock);

            // Check if there is cached element and if we can reuse it
            if (element) {
                if (element.parentNode == parent) {
                    // Remove nodes before the one we are hitting since they don't appear in Content Model at this position.
                    // But we don't want to touch entity since it would better to keep entity at its place unless it is removed
                    // In that case we will remove it after we have handled all other nodes
                    while (refNode && refNode != element && !isEntity(refNode)) {
                        refNode = remove(refNode);
                    }

                    if (refNode && refNode == element) {
                        refNode = refNode.nextSibling;
                    } else {
                        parent.insertBefore(element, refNode);
                    }
                } else if (element) {
                    parent.insertBefore(element, refNode);
                }

                if (childBlock.blockType == 'BlockGroup') {
                    context.modelHandlers.blockGroupChildren(doc, element, childBlock, context);
                }
            } else {
                context.modelHandlers.block(doc, parent, childBlock, context, refNode);
            }
        });

        // Remove all rest node if any since they don't appear in content model
        while (refNode) {
            refNode = remove(refNode);
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
