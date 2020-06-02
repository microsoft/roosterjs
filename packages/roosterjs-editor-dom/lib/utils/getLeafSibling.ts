import contains from './contains';
import getTagOfNode from './getTagOfNode';
import shouldSkipNode from './shouldSkipNode';

/**
 * This walks forwards/backwards DOM tree to get next meaningful node
 * @param rootNode Root node to scope the leaf sibling node
 * @param startNode current node to get sibling node from
 * @param isNext True to get next leaf sibling node, false to get previous leaf sibling node
 * @param skipTags (Optional) tags that child elements will be skipped
 * @param ignoreSpace (Optional) Ignore pure space text node when check if the node should be skipped
 */
export function getLeafSibling(
    rootNode: Node,
    startNode: Node,
    isNext: boolean,
    skipTags?: string[],
    ignoreSpace?: boolean
): Node {
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
            while (
                curNode &&
                (!skipTags || skipTags.indexOf(getTagOfNode(curNode)) < 0) &&
                getChild(curNode)
            ) {
                curNode = getChild(curNode);
            }

            // Check special nodes (i.e. node that has a display:none etc.) and continue looping if so
            shouldContinue = curNode && shouldSkipNode(curNode, ignoreSpace);
            if (!shouldContinue) {
                // Found a good leaf node, assign and exit
                result = curNode;
                break;
            }
        }
    }

    return result;
}

/**
 * This walks forwards DOM tree to get next meaningful node
 * @param rootNode Root node to scope the leaf sibling node
 * @param startNode current node to get sibling node from
 * @param skipTags (Optional) tags that child elements will be skipped
 */
export function getNextLeafSibling(rootNode: Node, startNode: Node, skipTags?: string[]): Node {
    return getLeafSibling(rootNode, startNode, true /*isNext*/, skipTags);
}

/**
 * This walks backwards DOM tree to get next meaningful node
 * @param rootNode Root node to scope the leaf sibling node
 * @param startNode current node to get sibling node from
 * @param skipTags (Optional) tags that child elements will be skipped
 */
export function getPreviousLeafSibling(rootNode: Node, startNode: Node, skipTags?: string[]): Node {
    return getLeafSibling(rootNode, startNode, false /*isNext*/, skipTags);
}
