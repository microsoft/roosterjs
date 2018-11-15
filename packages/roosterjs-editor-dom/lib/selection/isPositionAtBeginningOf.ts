import contains from '../utils/contains';
import isNodeEmpty from '../utils/isNodeEmpty';
import { NodePosition } from 'roosterjs-editor-types';

/**
 * Check if this position is at beginning of the given node.
 * This will return true if all nodes between the beginning of target node and the position are empty.
 * @param position The position to check
 * @param targetNode The node to check
 * @returns True if position is at beginning of the node, otherwise false
 */
export default function isPositionAtBeginningOf(position: NodePosition, targetNode: Node) {
    if (position) {
        let { node, offset } = position.normalize();
        if (offset == 0) {
            while (contains(targetNode, node) && areAllPrevousNodesEmpty(node)) {
                node = node.parentNode;
            }

            return node == targetNode;
        }
    }

    return false;
}

function areAllPrevousNodesEmpty(node: Node): boolean {
    while (node.previousSibling) {
        node = node.previousSibling;
        if (!isNodeEmpty(node)) {
            return false;
        }
    }
    return true;
}
