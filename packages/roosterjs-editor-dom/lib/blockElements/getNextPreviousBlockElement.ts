import BlockElement from './BlockElement';
import { getLeafSibling } from '../domWalker/getLeafSibling';
import getBlockElementAtNode from './getBlockElementAtNode';

/**
 * Get next block
 */
export function getNextBlockElement(rootNode: Node, blockElement: BlockElement) {
    return getNextPreviousBlockElement(rootNode, blockElement, true /*isNext*/);
}

/**
 * Get previous block
 */
export function getPreviousBlockElement(rootNode: Node, blockElement: BlockElement) {
    return getNextPreviousBlockElement(rootNode, blockElement, false /*isNext*/);
}

function getNextPreviousBlockElement(
    rootNode: Node,
    blockElement: BlockElement,
    isNext: boolean
): BlockElement {
    if (!blockElement) {
        return null;
    }

    // Get a leaf node after block's end element and use that base to find next block
    // TODO: this code is used to identify block, maybe we shouldn't exclude those empty nodes
    // We can improve this later on
    let leaf = getLeafSibling(rootNode, isNext ? blockElement.getEndNode() : blockElement.getStartNode(), isNext);
    return getBlockElementAtNode(rootNode, leaf);
}
