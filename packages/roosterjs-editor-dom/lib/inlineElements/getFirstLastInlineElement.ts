import { getFirstLeafNode, getLastLeafNode } from '../utils/getLeafNode';
import { InlineElement } from 'roosterjs-editor-types';
import getInlineElementAtNode from './getInlineElementAtNode';

/**
 * Get the first inline element inside the given node
 */
export function getFirstInlineElement(rootNode: Node): InlineElement {
    // getFirstLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    let node = getFirstLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node) : null;
}

/**
 * Get the last inline element inside the given node
 */
export function getLastInlineElement(rootNode: Node): InlineElement {
    // getLastLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    let node = getLastLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node) : null;
}
