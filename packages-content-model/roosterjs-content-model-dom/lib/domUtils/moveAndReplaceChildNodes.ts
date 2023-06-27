/**
 * Replace all child nodes of the given target node to the child nodes of source node.
 * @param target Target node, all child nodes of this node will be removed if keepExistingChildren is not set to true
 * @param source (Optional) source node, all child nodes of this node will be move to target node
 */
export function moveAndReplaceChildNodes(target: Node, source?: Node) {
    while (target.firstChild) {
        target.removeChild(target.firstChild);
    }

    while (source?.firstChild) {
        target.appendChild(source.firstChild);
    }
}
