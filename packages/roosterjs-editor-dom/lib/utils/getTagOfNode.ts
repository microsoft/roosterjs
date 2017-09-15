import { NodeType } from 'roosterjs-editor-types';

// Returns the html tag of a node, or empty if it is not an element
export default function getTagOfNode(node: Node): string {
    // TODO: we need to standardize on use of lower or upper case
    return node && node.nodeType == NodeType.Element ? (node as Element).tagName.toUpperCase() : '';
}
