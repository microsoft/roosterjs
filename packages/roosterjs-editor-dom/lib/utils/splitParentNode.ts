import isNodeEmpty from './isNodeEmpty';

/**
 * Split parent node of the given node before/after the given node.
 * When a parent node contains [A,B,C] and pass B as the given node,
 * If split before, the new nodes will be [A][B,C] and returns [A];
 * otherwise, it will be [A,B][C] and returns [C].
 * @param node The node to split before/after
 * @param splitBefore Whether split before or after
 * @param removeEmptyNewNode If the new node is empty (even then only child is space or ZER_WIDTH_SPACE),
 * we remove it. @default false
 * @returns The new parent node
 */
export default function splitParentNode(
    node: Node,
    splitBefore: boolean,
    removeEmptyNewNode?: boolean
): Node {
    let parentNode = node.parentNode;
    let newParent = parentNode.cloneNode(false /*deep*/);
    if (splitBefore) {
        while (parentNode.firstChild && parentNode.firstChild != node) {
            newParent.appendChild(parentNode.firstChild);
        }
    } else {
        while (node.nextSibling) {
            newParent.appendChild(node.nextSibling);
        }
    }

    // When the only child of new parent is ZERO_WIDTH_SPACE, we can still prevent keeping it by set removeEmptyNewNode to true
    if (newParent.firstChild && !(removeEmptyNewNode && isNodeEmpty(newParent))) {
        parentNode.parentNode.insertBefore(
            newParent,
            splitBefore ? parentNode : parentNode.nextSibling
        );
    } else {
        newParent = null;
    }

    return newParent;
}
