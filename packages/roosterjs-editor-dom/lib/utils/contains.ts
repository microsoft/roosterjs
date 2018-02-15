import isDocumentPosition from './isDocumentPosition';
import { DocumentPosition } from 'roosterjs-editor-types';

// Test if a node contains another node
export default function contains(
    container: Node,
    contained: Node,
    treatSameNodeAsContain: boolean = false
): boolean {
    return container &&
        contained &&
        (
            (treatSameNodeAsContain && container == contained) ||
            isDocumentPosition(
                container.compareDocumentPosition(contained),
                DocumentPosition.ContainedBy
            )
        );
}
