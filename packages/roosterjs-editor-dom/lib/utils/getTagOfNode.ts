import { NodeType } from 'roosterjs-editor-types';

/**
 * Get the html tag of a node, or empty if it is not an element
 * @param node The node to get tag of
 * @returns Tag name in upper case if the given node is an Element, or empty string otherwise
 */
export default function getTagOfNode(node: Node | null): string {
    return node && node.nodeType == NodeType.Element ? (<Element>node).tagName.toUpperCase() : '';
}
