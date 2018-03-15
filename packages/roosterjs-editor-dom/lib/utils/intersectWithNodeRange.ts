import isDocumentPosition from './isDocumentPosition';
import { DocumentPosition } from 'roosterjs-editor-types';

export default function intersectWithNodeRange(
    node: Node,
    start: Node,
    end: Node,
    containOnly: boolean
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
