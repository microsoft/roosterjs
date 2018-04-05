import { NodeType } from 'roosterjs-editor-types';

/**
 * Get element from node or its parent
 * @param node The node to get element from
 * @returns node itself if the node is an element, or its parent node
 */
export default function getElementOrParentElement(node: Node): HTMLElement {
    node = !node ? null : node.nodeType == NodeType.Element ? node : node.parentNode;
    return node && node.nodeType == NodeType.Element ? <HTMLElement>node : null;
}
