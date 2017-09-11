import shouldSkipNode from './shouldSkipNode';
import { getLeafSibling } from './getLeafSibling';

function getLeafNode(rootNode: Node, isFirst: boolean): Node {
    let getChild = isFirst ? (node: Node) => node.firstChild : (node: Node) => node.lastChild;
    let result = getChild(rootNode);
    while (result && getChild(result)) {
        result = getChild(result);
    }

    if (result && shouldSkipNode(result)) {
        result = getLeafSibling(rootNode, result, isFirst);
    }

    return result;
}

// Get the first meaningful leaf node
// NOTE: this can return null for empty container or
// container that does not contain any meaningful node
export function getFirstLeafNode(rootNode: Node): Node {
    return getLeafNode(rootNode, true /*isFirst*/);
}

// Get the last meaningful leaf node
// NOTE: this can return null for empty container or
// container that does not contain any meaningful node
export function getLastLeafNode(rootNode: Node): Node {
    return getLeafNode(rootNode, false /*isFirst*/);
}
