import getTagOfNode from './getTagOfNode';
import { NodeType } from 'roosterjs-editor-types';

/**
 * Find closest element ancestor of a specific tag element
 * @param node Find ancestor start from this node
 * @param root Root node where the search should stop at. The return value can never be this node
 * @param tag Tag of the element to find.
 * @returns An HTML element which is the closest ancestor with the provided Tag, returns null if not found and reached the root element
 */
export default function findClosestElementTypeAncestor(node: Node, root: Node, tag: string): Node {
    if (root) {
        node = !node ? null : node.nodeType == NodeType.Element ? node : node.parentNode;
        let element = node && node.nodeType == NodeType.Element ? <HTMLElement>node : null;

        while (element && element != root) {
            element = element.parentElement;
            if (getTagOfNode(element) == tag) {
                return element;
            }
        }
    }

    return null;
}
