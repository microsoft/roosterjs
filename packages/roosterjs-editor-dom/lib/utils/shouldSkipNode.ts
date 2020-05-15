import getTagOfNode from './getTagOfNode';
import { getComputedStyle } from './getComputedStyles';
import { NodeType } from 'roosterjs-editor-types';

const CRLF = /^[\r\n]+$/gm;

/**
 * Skip a node when any of following conditions are true
 * - it is neither Element nor Text
 * - it is a text node but is empty
 * - it is a text node but contains just CRLF (noisy text node that often comes in-between elements)
 * - has a display:none
 * - it is just <div></div>
 */
export default function shouldSkipNode(node: Node): boolean {
    if (node.nodeType == NodeType.Text) {
        return !node.nodeValue || node.textContent == '' || CRLF.test(node.nodeValue);
    } else if (node.nodeType == NodeType.Element) {
        return (
            (getTagOfNode(node) == 'DIV' && !node.firstChild) ||
            getComputedStyle(node, 'display') == 'none'
        );
    } else {
        return true;
    }
}
