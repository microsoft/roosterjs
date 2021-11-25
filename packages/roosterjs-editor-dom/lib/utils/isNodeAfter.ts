import { DocumentPosition } from 'roosterjs-editor-types';

/**
 * Checks if node1 is after node2
 * @param node1 The node to check if it is after another node
 * @param node2 The node to check if another node is after this one
 * @returns True if node1 is after node2, otherwise false
 */
export default function isNodeAfter(node1: Node, node2: Node): boolean {
    return !!(
        node1 &&
        node2 &&
        (node2.compareDocumentPosition(node1) & DocumentPosition.Following) ==
            DocumentPosition.Following
    );
}
