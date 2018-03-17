import isDocumentPosition from './isDocumentPosition';
import { DocumentPosition } from 'roosterjs-editor-types';

/**
 * Check if a given node has intersection with the given node range
 * @param node The node to check
 * @param start Start node of the range
 * @param end End node of the range
 * @param containOnly When set to true, will return true only when the node is between
 * start and end nodes or contained by start or end node. When set to false, also return true
 * if the node contains both start and end node
 * @return True if the node has intersection with the range. Otherwise false
 */
export default function intersectWithNodeRange(
    node: Node,
    start: Node,
    end: Node,
    containOnly?: boolean
): boolean {
    let startPosition = node.compareDocumentPosition(start);
    let endPosition = node.compareDocumentPosition(end);
    let targetPositions = [DocumentPosition.Same, DocumentPosition.Contains];
    if (!containOnly) {
        targetPositions.push(DocumentPosition.ContainedBy);
    }
    let intersectStart = isDocumentPosition(startPosition, targetPositions);
    let intersectEnd = isDocumentPosition(endPosition, targetPositions);

    return (
        intersectStart ||
        intersectEnd ||
        (isDocumentPosition(startPosition, DocumentPosition.Preceding) &&
            isDocumentPosition(endPosition, DocumentPosition.Following))
    );
}
