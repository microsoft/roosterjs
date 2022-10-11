import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { handleBlock } from './handleBlock';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export function handleBlockGroupChildren(
    doc: Document,
    parent: Node,
    group: ContentModelBlockGroup,
    context: ModelToDomContext
) {
    const { listFormat } = context;
    const nodeStack = listFormat.nodeStack;

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

            handleBlock(doc, parent, childBlock, context);
        });
    } finally {
        listFormat.nodeStack = nodeStack;
    }
}
