/**
 * Removes the node and keep all children in place, return the parentNode where the children are attached
 * @param node the node to remove
 */
export default function unwrap(node: Node): Node {
    // Unwrap requires a parentNode
    let parentNode = node ? node.parentNode : null;
    if (!parentNode) {
        return null;
    }

    while (node.firstChild) {
        parentNode.insertBefore(node.firstChild, node);
    }

    parentNode.removeChild(node);
    return parentNode;
}
