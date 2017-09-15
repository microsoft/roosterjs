import isDocumentPosition from './isDocumentPosition';
import { DocumentPosition } from 'roosterjs-editor-types';

// Checks if node1 is after node2
export default function isNodeAfter(node1: Node, node2: Node): boolean {
    return !!(
        node1 &&
        node2 &&
        isDocumentPosition(node2.compareDocumentPosition(node1), DocumentPosition.Following)
    );
}
