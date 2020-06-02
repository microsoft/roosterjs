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
        const tag = getTagOfNode(node);
        if (tag == 'SPAN' || tag == 'DIV') {
            if (getComputedStyle(node, 'display') == 'none') {
                return true;
            }

            // Empty SPAN/DIV or SPAN/DIV with only unmeaningful children is unmeaningful,
            // because it can render nothing. If we keep them here, there may be unexpected
            // LI elements added for those unmeaningful nodes.
            for (let child = node.firstChild; !!child; child = child.nextSibling) {
                if (!shouldSkipNode(child)) {
                    return false;
                }
            }
            return true;
        } else {
            // There may still be other cases that the node is not meaningful.
            // We can add those cases here once we hit them.
            return false;
        }
    } else {
        return true;
    }
}
