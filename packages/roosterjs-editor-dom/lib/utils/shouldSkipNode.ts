import { NodeType } from 'roosterjs-editor-types';
import { getComputedStyle } from './getComputedStyles';

const CRLF = /^[\r\n]+$/gm;

/**
 * Skip a node when any of following conditions are true
 * - it is neither Element nor Text
 * - it is a text node but is empty
 * - it is a text node but contains just CRLF (noisy text node that often comes in-between elements)
 * - has a display:none
 */
export default function shouldSkipNode(node: Node): boolean {
    if (node.nodeType == NodeType.Text) {
        return !node.nodeValue || node.textContent == '' || CRLF.test(node.nodeValue);
    } else if (node.nodeType == NodeType.Element) {
        return getComputedStyle(node, 'display') == 'none';
    } else {
        return true;
    }
}
