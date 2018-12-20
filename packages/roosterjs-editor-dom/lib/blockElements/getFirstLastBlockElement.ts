import { BlockElement } from 'roosterjs-editor-types';
import getBlockElementAtNode from './getBlockElementAtNode';

/**
 * Get the first/last BlockElement of under the root node.
 * If no suitable BlockElement found, returns null
 * @param rootNode The root node to get BlockElement from
 * @param isFirst True to get first BlockElement, false to get last BlockElement
 */
export function getFirstLastBlockElement(rootNode: Node, isFirst: boolean): BlockElement {
    let node = rootNode;
    do {
        node = node && (isFirst ? node.firstChild : node.lastChild);
    } while (node && node.firstChild);
    return node && getBlockElementAtNode(rootNode, node);
}

/**
 * Get the first BlockElement of under the root node.
 * If no suitable BlockElement found, returns null
 * @param rootNode The root node to get BlockElement from
 */
export function getFirstBlockElement(rootNode: Node): BlockElement {
    return getFirstLastBlockElement(rootNode, true /*isFirst*/);
}

/**
 * Get the last BlockElement of under the root node.
 * If no suitable BlockElement found, returns null
 * @param rootNode The root node to get BlockElement from
 */
export function getLastBlockElement(rootNode: Node): BlockElement {
    return getFirstLastBlockElement(rootNode, false /*isFirst*/);
}
