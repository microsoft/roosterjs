import { cleanUpRestNodes } from '../utils/cleanUpRestNodes';
import type {
    ContentModelBlockGroup,
    ContentModelHandler,
    ModelToDomContext,
    ModelToDomListStackItem,
    RewriteFromModel,
} from 'roosterjs-content-model-types';

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
                if (context.allowCacheListItem) {
                    cleanUpNodeState(listFormat.nodeStack, context.rewriteFromModel);
                }

                listFormat.nodeStack = [];
            }

            refNode = context.modelHandlers.block(doc, parent, childBlock, context, refNode);

            if (childBlock.blockType == 'Entity') {
                context.domIndexer?.onBlockEntity(childBlock, group);
            }
        });

        if (context.allowCacheListItem) {
            cleanUpNodeState(listFormat.nodeStack, context.rewriteFromModel);
        }

        // Remove all rest node if any since they don't appear in content model
        cleanUpRestNodes(refNode, context.rewriteFromModel);
    } finally {
        listFormat.nodeStack = nodeStack;
    }
};

function cleanUpNodeState(nodeStack: ModelToDomListStackItem[], rewriteContext: RewriteFromModel) {
    // Clear list stack, only run to nodeState[1] because nodeState[0] is the parent node
    for (let i = nodeStack.length - 1; i > 0; i--) {
        const node = nodeStack.pop()?.refNode ?? null;

        cleanUpRestNodes(node, rewriteContext);
    }
}
