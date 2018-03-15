import getComputedStyle from '../utils/getComputedStyle';
import { NodeType } from 'roosterjs-editor-types';

/**
 * Skip a node when any of following conditions are true
 * - it is neither Element nor Text
 * - it is a text node but is empty
 * - it is a text node but contains just CRLF (noisy text node that often comes in-between elements)
 * - has a display:none
 */
export default function shouldSkipNode(node: Node): boolean {
    if (node && node.nodeType == NodeType.Text) {
        return /^[\r\n]*$/.test(node.nodeValue);
    } else if (node && node.nodeType == NodeType.Element) {
        return getComputedStyle(node, 'display')[0] == 'none';
    } else {
        return true;
    }
}
