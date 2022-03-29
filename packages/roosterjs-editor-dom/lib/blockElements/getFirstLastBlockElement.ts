import getBlockElementAtNode from './getBlockElementAtNode';
import { BlockElement } from 'roosterjs-editor-types';

/**
 * Get the first/last BlockElement of under the root node.
 * If no suitable BlockElement found, returns null
 * @param rootNode The root node to get BlockElement from
 * @param isFirst True to get first BlockElement, false to get last BlockElement
 */
export default function getFirstLastBlockElement(
    rootNode: Node,
    isFirst: boolean
): BlockElement | null {
    let node: Node | null = rootNode;
    do {
        node = node && (isFirst ? node.firstChild : node.lastChild);
    } while (node && node.firstChild);
    return (node && getBlockElementAtNode(rootNode, node)) || null;
}
