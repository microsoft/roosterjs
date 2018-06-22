import Position from '../selection/Position';
import contains from './contains';
import isNodeEmpty from './isNodeEmpty';
import { NodeType } from 'roosterjs-editor-types';

/**
 * Check if the given position is at beginning of the given node
 * @param position The position to check
 * @param targetNode The node to check
 * @returns True if position is at beginning of the node, otherwise false
 */
export default function isPositionAtBeginningOf(position: Position, targetNode: Node): boolean;

/**
 * Check if the given selection range is collapsed and at beginning of the given node
 * @param range The selection range to check
 * @param targetNode The node to check
 * @returns True if range is collapsed and at beginning of the node, otherwise false
 */
export default function isPositionAtBeginningOf(range: Range, targetNode: Node): boolean;

export default function isPositionAtBeginningOf(pos: Position | Range, targetNode: Node) {
    if (pos) {
        let node: Node;
        let offset: number;
        if (!(pos instanceof Range)) {
            node = pos.node;
            offset = pos.offset;
        } else if (pos.collapsed) {
            node = pos.startContainer;
            offset = pos.startOffset;
        } else {
            return false;
        }

        if (offset == 0) {
            while (
                contains(targetNode, node) &&
                (!node.previousSibling || isNodeEmpty(node.previousSibling))
            ) {
                node = node.parentNode;
            }

            if (node == targetNode) {
                return true;
            }
        } else {
            return node.nodeType == NodeType.Element && node.childNodes[offset] == targetNode;
        }
    }
    return false;
}
