/**
 * Split parent node of the given node before/after the given node.
 * When a parent node contains [A,B,C] and pass B as the given node,
 * If split before, the new nodes will be [A][B,C] and returns [A];
 * otherwise, it will be [A,B][C] and returns [C].
 * @param node The node to split before/after
 * @param splitBefore Whether split before or after
 * @returns The new parent node
 */
export default function splitParentNode(node: Node, splitBefore: boolean): Node {
    let parentNode = node.parentNode;
    let newParent = parentNode.cloneNode(false /*deep*/);
    if (splitBefore) {
        while (parentNode.firstChild && parentNode.firstChild != node) {
            newParent.appendChild(parentNode.firstChild);
        }
    } else {
        while (node.nextSibling) {
            newParent.appendChild(node.nextSibling);
        }
    }
    if (newParent.firstChild) {
        parentNode.parentNode.insertBefore(
            newParent,
            splitBefore ? parentNode : parentNode.nextSibling
        );
    } else {
        newParent = null;
    }
    return newParent;
}
