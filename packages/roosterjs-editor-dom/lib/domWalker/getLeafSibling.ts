import contains from '../utils/contains';
import shouldSkipNode from './shouldSkipNode';

/**
 * This walks forwards (from left to right) DOM tree to get next meaningful node
 * A null is returned when it reaches the very end - beyond the scope as defined by rootNode
 */
export function getNextLeafSibling(rootNode: Node, startNode: Node): Node {
    return getLeafSibling(rootNode, startNode, true /*isNext*/);
}

/**
 * This walks backwards (from right to left) DOM tree to get previous meaningful node
 * A null is returned when it reaches the very first - beyond the scope as defined by rootNode
 */
export function getPreviousLeafSibling(rootNode: Node, startNode: Node): Node {
    return getLeafSibling(rootNode, startNode, false /*isNext*/);
}

export function getLeafSibling(rootNode: Node, startNode: Node, isNext: boolean, stop?: (node: Node) => boolean): Node {
    let getSibling = (node: Node) => isNext ? node.nextSibling : node.previousSibling;
    let getChild = (node: Node) => isNext ? node.firstChild : node.lastChild;

    if (!contains(rootNode, startNode)) {
        return null;
    }

    let curNode: Node;
    for (curNode = startNode; curNode;) {
        // Find next/previous node, starting from next/previous sibling, then one level up to find next/previous sibling from parent
        // till a non-null nextSibling/previousSibling is found or the ceiling is encountered (rootNode)
        let parentNode = curNode.parentNode;
        curNode = getSibling(curNode);
        while (!curNode && parentNode != rootNode) {
            curNode = getSibling(parentNode);
            parentNode = parentNode.parentNode;
        }

        if (stop && stop(curNode)) {
            return curNode;
        }

        // Now traverse down to get first/last child
        while (curNode && curNode.hasChildNodes()) {
            curNode = getChild(curNode);
            if (stop && stop(curNode)) {
                return curNode;
            }
        }

        if (!shouldSkipNode(curNode)) {
            break;
        }
    }

    return curNode;
}
