import shouldSkipNode from './shouldSkipNode';
import { getLeafSibling } from './getLeafSibling';

/**
 * Get first/last leaf node of the given root node.
 * @param rootNode Root node to get leaf node from
 * @param isFirst True to get first leaf node, false to get last leaf node
 */
function getLeafNode(rootNode: Node, isFirst: boolean): Node {
    let getChild = (node: Node): Node => (isFirst ? node.firstChild : node.lastChild);
    let result = getChild(rootNode);
    while (result && getChild(result)) {
        result = getChild(result);
    }

    if (result && shouldSkipNode(result)) {
        result = getLeafSibling(rootNode, result, isFirst);
    }

    return result;
}

/**
 * Get the first meaningful leaf node
 * @param rootNode Root node to get leaf node from
 */
export function getFirstLeafNode(rootNode: Node): Node {
    return getLeafNode(rootNode, true /*isFirst*/);
}

/**
 * Get the last meaningful leaf node
 * @param rootNode Root node to get leaf node from
 */
export function getLastLeafNode(rootNode: Node): Node {
    return getLeafNode(rootNode, false /*isFirst*/);
}
