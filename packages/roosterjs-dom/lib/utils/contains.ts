import isDocumentPosition from './isDocumentPosition';
import { DocumentPosition } from 'roosterjs-types';

// Test if a node contains another node
export default function contains(container: Node, contained: Node): boolean {
    return !!(
        container &&
        contained &&
        isDocumentPosition(
            container.compareDocumentPosition(contained),
            DocumentPosition.ContainedBy
        )
    );
}
