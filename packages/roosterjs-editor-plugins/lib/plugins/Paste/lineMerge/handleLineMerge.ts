import {
    changeElementTag,
    ContentTraverser,
    getBlockElementAtNode,
    getNextLeafSibling,
    getPreviousLeafSibling,
    getTagOfNode,
} from 'roosterjs-editor-dom';

/**
 * Process pasted content, if there are multiple blocks that are not wrapped by a shared ancestor node,
 * change the tag of first and last node to be SPAN so that it will be merged into current block
 * @param root Root node of content to process
 */
export default function handleLineMerge(root: Node) {
    const traverser = ContentTraverser.createBodyTraverser(root);
    const blocks: { start: Node; end: Node }[] = [];

    for (
        let block = traverser?.currentBlockElement;
        block;
        block = traverser.getNextBlockElement()
    ) {
        blocks.push({
            start: block.getStartNode(),
            end: block.getEndNode(),
        });
    }

    if (blocks.length > 0) {
        processBlock(blocks[0]);
        processBlock(blocks[blocks.length - 1]);
        checkAndAddBr(root, blocks[0], true /*isFirst*/);
        checkAndAddBr(root, blocks[blocks.length - 1], false /*isFirst*/);
    }
}

function processBlock(block: { start: Node; end: Node }) {
    const { start, end } = block;

    if (start == end && getTagOfNode(start) == 'DIV') {
        const node = changeElementTag(start as HTMLElement, 'SPAN');
        block.start = node;
        block.end = node;

        if (getTagOfNode(node.lastChild) == 'BR') {
            node.removeChild(node.lastChild);
        }
    } else if (getTagOfNode(end) == 'BR') {
        const node = end.ownerDocument.createTextNode('');
        end.parentNode?.insertBefore(node, end);
        block.end = node;
        end.parentNode?.removeChild(end);
    }
}

function checkAndAddBr(root: Node, block: { start: Node; end: Node }, isFirst: boolean) {
    const blockElement = getBlockElementAtNode(root, block.start);
    const sibling = isFirst
        ? getNextLeafSibling(root, block.end)
        : getPreviousLeafSibling(root, block.start);

    if (blockElement?.contains(sibling)) {
        (isFirst ? block.end : block.start).parentNode?.insertBefore(
            block.start.ownerDocument.createElement('br'),
            isFirst ? block.end.nextSibling : block.start
        );
    }
}
