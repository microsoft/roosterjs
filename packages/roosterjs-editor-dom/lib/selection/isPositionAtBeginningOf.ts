import contains from '../utils/contains';
import getTagOfNode from '../utils/getTagOfNode';
import isNodeEmpty from '../utils/isNodeEmpty';
import { NodePosition } from 'roosterjs-editor-types';

/**
 * Check if this position is at beginning of the given node.
 * This will return true if all nodes between the beginning of target node and the position are empty.
 * @param position The position to check
 * @param targetNode The node to check
 * @returns True if position is at beginning of the node, otherwise false
 */
export default function isPositionAtBeginningOf(position: NodePosition, targetNode: Node | null) {
    if (position) {
        position = position.normalize();
        let node: Node | null = position.node;
        const offset = position.offset;
        if (offset == 0) {
            while (node && contains(targetNode, node) && areAllPreviousNodesEmpty(node)) {
                node = node?.parentNode || null;
            }

            return node == targetNode;
        }
    }

    return false;
}

function areAllPreviousNodesEmpty(node: Node): boolean {
    while (node.previousSibling) {
        node = node.previousSibling;
        if (getTagOfNode(node) == 'BR' || !isNodeEmpty(node)) {
            return false;
        }
    }
    return true;
}
