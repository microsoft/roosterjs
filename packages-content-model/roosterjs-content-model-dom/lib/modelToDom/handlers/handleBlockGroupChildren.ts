import {
    ContentModelBlockGroup,
    ContentModelBlockHandler,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleBlockGroupChildren: ContentModelBlockHandler<ContentModelBlockGroup> = (
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

    return null;
};
