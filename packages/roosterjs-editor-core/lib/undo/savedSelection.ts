import {SavedSelection} from 'roosterjs-editor-types';

export function getSavedSelection(selectionRange: Range, pathRoot: HTMLElement): SavedSelection {
    let startPath = getNodePath(
        pathRoot,
        selectionRange.startContainer,
        selectionRange.startOffset
    );
    let endPath = getNodePath(pathRoot, selectionRange.endContainer, selectionRange.endOffset);
    return {
        startPath,
        endPath,
    };
}

export function getRangeFromSavedSelection(
    selection: SavedSelection,
    pathRoot: HTMLElement
): Range {
    const [startContainer, startOffset] = getContainerAndOffset(pathRoot, selection.startPath);
    const [endContainer, endOffset] = getContainerAndOffset(pathRoot, selection.endPath);
    const selectionRange = pathRoot.ownerDocument.createRange();
    selectionRange.setStart(startContainer, startOffset);
    selectionRange.setEnd(endContainer, endOffset);
    return selectionRange;
}

function getContainerAndOffset(node: Node, path: number[]): [Node, number] {
    let container: Node = node;
    // Iterate with a for loop to avoid mutating the passed in element path stack
    // or needing to copy it.
    for (let i = 0; i < path.length - 1; i++) {
        if (container instanceof Element) {
            if (container.childNodes.length <= path[i]) {
                // TODO log an error here.
                // We tried to walk past the end of a container.
                throw new Error('Tried to step past end of container during selection restoration');
            }
            container = container.childNodes[path[i]];
        } else if (container instanceof Text) {
            // TODO log a warning here. We hit a text element before the end of the path
            throw new Error('Hit Text node before end of path');
        }
    }

    return [container, path[path.length - 1]];
}

/**
 * Recursively get the path of the node relative to rootNode.
 * The path of the node is an array of integer indecies into the childNodes of the given node.
 *
 * The node path will be what the node path will be on a _normalized_ dom
 * (e.g. empty text nodes will be ignored and adjacent text nodes will be concatenated)
 *
 * @param rootNode the node the path will be relative to
 * @param node the node that is current parent of the offset
 * @param offsetInNode The index into node of the current element. Follows the same semantics
 * as selectionRange (if node is of type Text, it is an offset into the text of that node.
 * If node is of type Element, it is the index of a child in that Element node.)
 */
function getNodePath(rootNode: Element, node: Node, offsetInNode: number): number[] {
    if (node === null) {
        throw new Error('Stepped up to document root without encountering root node');
    }
    if (node === rootNode) {
        if (node.childNodes.length <= offsetInNode) {
            return [];
        }
        return [getNormalizedIndexInParent(node.childNodes[offsetInNode])];
    }
    if (node instanceof Text) {
        // offsetInNode refers to the offset into the text node.
        if (node.previousSibling instanceof Text) {
            // Consecutive text nodes are concatenated on serialization.
            // Use the same path as the previous sibling text node,
            // indexed past the end of the text.
            return getNodePath(
                rootNode,
                node.previousSibling,
                safeTextNodeLength(node.previousSibling) + offsetInNode
            );
        } else {
            return getNodePath(rootNode, node.parentNode, getIndexInParent(node)).concat([
                offsetInNode,
            ]);
        }
    }
    // For non-text nodes, recurse upward towards the root
    const child = node.childNodes[offsetInNode];
    const childNormalizedIndex = getNormalizedIndexInParent(child);
    return getNodePath(rootNode, node.parentNode, getIndexInParent(node)).concat([
        childNormalizedIndex,
    ]);
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
