import contains from '../utils/contains';
import shouldSkipNode from './shouldSkipNode';

export function getLeafSibling(rootNode: Node, startNode: Node, isNext: boolean): Node {
    let result = null;
    let getSibling = isNext
        ? (node: Node) => node.nextSibling
        : (node: Node) => node.previousSibling;
    let getChild = isNext ? (node: Node) => node.firstChild : (node: Node) => node.lastChild;
    if (contains(rootNode, startNode)) {
        let curNode = startNode;
        let shouldContinue = true;

        while (shouldContinue) {
            // Find next/previous node, starting from next/previous sibling, then one level up to find next/previous sibling from parent
            // till a non-null nextSibling/previousSibling is found or the ceiling is encountered (rootNode)
            let parentNode = curNode.parentNode;
            curNode = getSibling(curNode);
            while (!curNode && parentNode != rootNode) {
                curNode = getSibling(parentNode);
                parentNode = parentNode.parentNode;
            }

            // Now traverse down to get first/last child
            while (curNode && getChild(curNode)) {
                curNode = getChild(curNode);
            }

            // Check special nodes (i.e. node that has a display:none etc.) and continue looping if so
            shouldContinue = curNode && shouldSkipNode(curNode);
            if (!shouldContinue) {
                // Found a good leaf node, assign and exit
                result = curNode;
                break;
            }
        }
    }

    return result;
}

// This walks forwards (from left to right) DOM tree to get next meaningful node
// A null is returned when it reaches the very end - beyond the scope as defined by rootNode
export function getNextLeafSibling(rootNode: Node, startNode: Node): Node {
    return getLeafSibling(rootNode, startNode, true /*isNext*/);
}

// This walks backwards (from right to left) DOM tree to get previous meaningful node
// A null is returned when it reaches the very first - beyond the scope as defined by rootNode
export function getPreviousLeafSibling(rootNode: Node, startNode: Node): Node {
    return getLeafSibling(rootNode, startNode, false /*isNext*/);
}
