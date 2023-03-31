import {
    changeElementTag,
    ContentTraverser,
    findClosestElementAncestor,
    getBlockElementAtNode,
    getNextLeafSibling,
    getPreviousLeafSibling,
    getTagOfNode,
} from 'roosterjs-editor-dom';

/**
 * @internal
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
        const blocksLength = blocks.length - 1;
        processBlock(blocks[0]);
        processBlock(blocks[blocksLength]);
        checkAndAddBr(root, blocks[0], true /*isFirst*/);
        checkAndAddBr(root, blocks[blocksLength], false /*isFirst*/, blocks[0]);
    }
}

function processBlock(block: { start: Node; end: Node }) {
    const { start, end } = block;

    if (start == end && getTagOfNode(start) == 'DIV') {
        const node = changeElementTag(start as HTMLElement, 'SPAN') as Node;
        block.start = node;
        block.end = node;

        if (node && node.lastChild && getTagOfNode(node.lastChild) == 'BR') {
            node.removeChild(node.lastChild);
        }
    } else if (getTagOfNode(end) == 'BR') {
        const node = end.ownerDocument?.createTextNode('');
        if (node) {
            end.parentNode?.insertBefore(node, end);
            block.end = node;
            end.parentNode?.removeChild(end);
        }
    }
}

function checkAndAddBr(
    root: Node,
    block: { start: Node; end: Node },
    isFirst: boolean,
    firstBlock?: { start: Node; end: Node }
) {
    const blockElement = getBlockElementAtNode(root, block.start);
    const sibling = isFirst
        ? getNextLeafSibling(root, block.end)
        : getPreviousLeafSibling(root, block.start);

    if (!sibling) {
        return;
    }

    if (blockElement?.contains(sibling)) {
        const br = block.start.ownerDocument?.createElement('br');
        if (br) {
            const blockToUse = isFirst ? block.end : block.start;
            blockToUse.parentNode?.insertBefore(br, isFirst ? block.end.nextSibling : block.start);
        }
    } else if (
        firstBlock &&
        firstBlock.end == firstBlock.start &&
        getTagOfNode(firstBlock.end) == 'SPAN'
    ) {
        // If the first block and the last block are Siblings, add a BR before so the only two
        // lines that are being pasted are not merged.
        const previousSibling = getPreviousLeafSibling(root, block.start);
        if (
            firstBlock.end.contains(previousSibling) &&
            !findClosestElementAncestor(block.start, root, 'li')
        ) {
            const br = block.start.ownerDocument?.createElement('br');
            if (br) {
                block.start.parentNode?.insertBefore(br, block.start);
            }
        }
    }
}
