import { cleanUpRestNodes } from '../utils/cleanUpRestNodes';
import { isBlockFullyCached } from '../utils/isBlockFullyCached';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelHandler,
    ModelToDomContext,
    ModelToDomListStackItem,
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
                cleanUpNodeStack(listFormat.nodeStack, context);

                if (listFormat.nodeStack.length > 0) {
                    listFormat.nodeStack = [];
                }
            }

            // Fast path: if the block and all its descendants are fully cached (not mutated),
            // reuse the cached element directly without calling the full handler.
            // List items are excluded because their <li> is nested inside <ul>/<ol> and requires
            // list stack management that only the list handler can provide.
            if (
                context.allowCacheElement &&
                context.rewriteMutatedBlocksOnly &&
                !(
                    childBlock.blockType === 'BlockGroup' &&
                    childBlock.blockGroupType === 'ListItem'
                ) &&
                childBlock.blockType !== 'Entity' &&
                isBlockFullyCached(childBlock)
            ) {
                refNode = reuseCachedElement(
                    parent,
                    getCachedElement(childBlock)!,
                    refNode,
                    context.rewriteFromModel
                );
                // Call callbacks that the individual handlers would call for cached elements
                if (childBlock.blockType === 'Table') {
                    context.onNodeCreated?.(childBlock, childBlock.cachedElement!);
                    context.domIndexer?.onTable(childBlock.cachedElement!, childBlock);
                } else if (childBlock.blockType === 'Divider') {
                    context.onNodeCreated?.(childBlock, childBlock.cachedElement!);
                } else if (
                    childBlock.blockType === 'BlockGroup' &&
                    childBlock.blockGroupType === 'FormatContainer'
                ) {
                    context.onNodeCreated?.(childBlock, childBlock.cachedElement!);
                }
                // Paragraphs: no callbacks when reusing (matches existing handleParagraph behavior)
            } else {
                refNode = context.modelHandlers.block(doc, parent, childBlock, context, refNode);

                if (childBlock.blockType == 'Entity') {
                    context.domIndexer?.onBlockEntity(childBlock, group);
                }
            }
        });

        cleanUpNodeStack(listFormat.nodeStack, context);

        // Remove all rest node if any since they don't appear in content model
        cleanUpRestNodes(refNode, context.rewriteFromModel);
    } finally {
        listFormat.nodeStack = nodeStack;
    }
};

function getCachedElement(block: ContentModelBlock): HTMLElement | undefined {
    switch (block.blockType) {
        case 'Paragraph':
        case 'Table':
        case 'Divider':
            return block.cachedElement;
        case 'BlockGroup':
            // FormatContainer has cachedElement; ListItem is excluded from fast path
            return block.blockGroupType === 'FormatContainer' ? block.cachedElement : undefined;
        default:
            return undefined;
    }
}

function cleanUpNodeStack(nodeStack: ModelToDomListStackItem[], context: ModelToDomContext) {
    if (context.allowCacheListItem && nodeStack.length > 0) {
        // Clear list stack, only run to nodeStack[1] because nodeStack[0] is the parent node
        for (let i = nodeStack.length - 1; i > 0; i--) {
            const node = nodeStack.pop()?.refNode ?? null;

            cleanUpRestNodes(node, context.rewriteFromModel);
        }
    }
}
