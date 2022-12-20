import isNodeAfter from './isNodeAfter';

/**
 * Split parent node of the given node before/after the given node.
 * When a parent node contains [A,B,C] and pass B as the given node,
 * If split before, the new nodes will be [A][B,C] and returns [A];
 * otherwise, it will be [A,B][C] and returns [C].
 * @param node The node to split before/after
 * @param splitBefore Whether split before or after
 * @param removeEmptyNewNode If the new node is empty (even then only child is space or ZER_WIDTH_SPACE),
 * we remove it. @default false
 * @returns The new parent node
 */
export default function splitParentNode(node: Node, splitBefore: boolean): Node | null {
    if (!node || !node.parentNode) {
        return null;
    }

    let parentNode = node.parentNode;
    let newParent: HTMLElement | null = parentNode.cloneNode(false /*deep*/) as HTMLElement;
    newParent.removeAttribute('id');
    if (splitBefore) {
        while (parentNode.firstChild && parentNode.firstChild != node) {
            newParent.appendChild(parentNode.firstChild);
        }
    } else {
        while (node.nextSibling) {
            newParent.appendChild(node.nextSibling);
        }
    }

    // When the only child of new parent is ZERO_WIDTH_SPACE, we can still prevent keeping it by set removeEmptyNewNode to true
    if (newParent.firstChild && newParent.innerHTML != '') {
        parentNode.parentNode?.insertBefore(
            newParent,
            splitBefore ? parentNode : parentNode.nextSibling
        );
    } else {
        newParent = null;
    }

    return newParent;
}

/**
 * Split parent node by a balanced node range
 * @param nodes The nodes to split from. If only one node is passed, split it from all its siblings.
 * If two or nodes are passed, will split before the first one and after the last one, all other nodes will be ignored
 * @returns The parent node of the given node range if the given nodes are balanced, otherwise null
 */
export function splitBalancedNodeRange(nodes: Node | Node[]): Node | null {
    let start = Array.isArray(nodes) ? nodes[0] : nodes;
    let end = Array.isArray(nodes) ? nodes[nodes.length - 1] : nodes;
    const parentNode = start && end && start.parentNode == end.parentNode ? start.parentNode : null;
    if (parentNode) {
        if (isNodeAfter(start, end)) {
            let temp = end;
            end = start;
            start = temp;
        }
        splitParentNode(start, true /*splitBefore*/);
        splitParentNode(end, false /*splitBefore*/);
    }

    return parentNode;
}
