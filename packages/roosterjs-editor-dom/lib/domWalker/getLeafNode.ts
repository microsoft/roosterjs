import shouldSkipNode from './shouldSkipNode';
import { getLeafSibling } from './getLeafSibling';

/**
 * Get the first meaningful leaf node
 * This can return null for empty container or
 * container that does not contain any meaningful node
 */
export function getFirstLeafNode(rootNode: Node): Node {
    return getLeafNode(rootNode, true /*isFirst*/);
}

/**
 * Get the last meaningful leaf node
 * This can return null for empty container or
 * container that does not contain any meaningful node
 */
export function getLastLeafNode(rootNode: Node): Node {
    return getLeafNode(rootNode, false /*isFirst*/);
}

function getLeafNode(rootNode: Node, isFirst: boolean): Node {
    let getChild = (node: Node) => isFirst ? node.firstChild : node.lastChild;
    let result = getChild(rootNode);
    while (result && getChild(result)) {
        result = getChild(result);
    }

    if (result && shouldSkipNode(result)) {
        result = getLeafSibling(rootNode, result, isFirst);
    }

    return result;
}
