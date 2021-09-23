import { findClosestElementAncestor } from 'roosterjs-editor-dom';

/**
 * @internal
 * Verifies if the element provided have a element ancestor of a specific tag.
 * If the element ancestor exists, verifies that it is not part of the provided array,
 * if it is not included in the array pushes the element in the array
 * @param nodes array of nodes
 * @param currentNode Find ancestor start from this node
 * @param root Root node where the search should stop at. The return value can never be this node
 * @param selector The expected selector.
 */
export default function setElementsToVerifyStyle(
    nodes: Node[],
    currentNode: Node,
    root: Node,
    selector: string
) {
    let parent = findClosestElementAncestor(currentNode, root, selector);
    if (parent && nodes.indexOf(parent) === -1) {
        nodes.push(parent);
    }
}
