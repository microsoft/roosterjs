import getInlineElementAtNode from './getInlineElementAtNode';
import { getFirstLeafNode, getLastLeafNode } from '../utils/getLeafNode';
import { InlineElement } from 'roosterjs-editor-types';

/**
 * @internal
 * Get the first inline element inside the given node
 */
export function getFirstInlineElement(rootNode: Node): InlineElement | null {
    // getFirstLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    let node = getFirstLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node) : null;
}

/**
 * @internal
 * Get the last inline element inside the given node
 */
export function getLastInlineElement(rootNode: Node): InlineElement | null {
    // getLastLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    let node = getLastLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node) : null;
}
