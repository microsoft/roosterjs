import { NodePosition, NodeType } from 'roosterjs-editor-types';
import Position from './Position';

/**
 * Recursively get the path of the node relative to rootNode.
 * The path of the node is an array of integer indecies into the childNodes of the given node.
 *
 * The node path will be what the node path will be on a _normalized_ dom
 * (e.g. empty text nodes will be ignored and adjacent text nodes will be concatenated)
 *
 * @param rootNode the node the path will be relative to
 * @param position the position to get indexes from. Follows the same semantics
 * as selectionRange (if node is of type Text, it is an offset into the text of that node.
 * If node is of type Element, it is the index of a child in that Element node.)
 */
export default function getPositionIndexes(rootNode: Element, position: NodePosition): number[] {
    if (!position) {
        return [];
    }

    let { node, offset } = position;

    if (node === rootNode) {
        if (node.childNodes.length <= offset) {
            return [];
        }
        return [getNormalizedIndexInParent(node.childNodes[offset])];
    }

    if (node.nodeType == NodeType.Text) {
        // offsetInNode refers to the offset into the text node.
        if (node.previousSibling && node.previousSibling.nodeType == NodeType.Text) {
            // Consecutive text nodes are concatenated on serialization.
            // Use the same path as the previous sibling text node,
            // indexed past the end of the text.
            return getPositionIndexes(
                rootNode,
                new Position(
                    node.previousSibling,
                    safeTextNodeLength(node.previousSibling as Text) + offset
                )
            );
        } else {
            return getPositionIndexes(
                rootNode,
                new Position(node.parentNode, getIndexInParent(node))
            ).concat([offset]);
        }
    }
    // For non-text nodes, recurse upward towards the root
    const child = node.childNodes[offset];
    const childNormalizedIndex = getNormalizedIndexInParent(child);
    return getPositionIndexes(
        rootNode,
        new Position(node.parentNode, getIndexInParent(node))
    ).concat([childNormalizedIndex]);
}

/**
 * Get the index the node _will_ have in the parent after it is serialized and restored
 * to the DOM. (e.g. after normalization)
 */
function getNormalizedIndexInParent(node: Node): number {
    let index = 0;
    let nextTrackedSibling = null;
    while ((node = node.previousSibling) != null) {
        // Empty text nodes are removed
        if (node instanceof Text && safeTextNodeLength(node) == 0) {
            continue;
        }
        // Consecutive text nodes are concatenated
        if (!(node instanceof Text && nextTrackedSibling instanceof Text)) {
            index++;
        }

        nextTrackedSibling = node;
    }
    return index;
}

function getIndexInParent(node: Node): number {
    let i = 0;
    while ((node = node.previousSibling) != null) {
        i++;
    }
    return i;
}

/**
 * For empty text nodes, node.textContent is undefined,
 * so accessing node.length (implemented in some environments
 * as a getter for textContent.length) may throw.
 */
function safeTextNodeLength(node: Text) {
    return node.textContent ? node.textContent.length : 0;
}
