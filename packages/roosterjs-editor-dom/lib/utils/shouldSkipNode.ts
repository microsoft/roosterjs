import getTagOfNode from './getTagOfNode';
import { getComputedStyle } from './getComputedStyles';
import { NodeType } from 'roosterjs-editor-types';

const CRLF = /^[\r\n]+$/g;
const CRLF_SPACE = /[\t\r\n\u0020\u200B]/gm; // We should only find new line, real space or ZeroWidthSpace (TAB, %20, but not &nbsp;)

/**
 * @internal
 * Skip a node when any of following conditions are true
 * - it is neither Element nor Text
 * - it is a text node but is empty
 * - it is a text node but contains just CRLF (noisy text node that often comes in-between elements)
 * - has a display:none
 * - it is just <div></div>
 * @param node The node to check
 * @param ignoreSpace (Optional) True to ignore pure space text node of the node when check.
 * If the value of a node value is only space, set this to true will treat this node can be skipped.
 * Default value is false
 */
export default function shouldSkipNode(node: Node, ignoreSpace?: boolean): boolean {
    if (node.nodeType == NodeType.Text) {
        if (!node.nodeValue || node.textContent == '' || CRLF.test(node.nodeValue)) {
            return true;
        } else if (ignoreSpace && node.nodeValue.replace(CRLF_SPACE, '') == '') {
            return true;
        } else {
            return false;
        }
    } else if (node.nodeType == NodeType.Element) {
        if (getComputedStyle(node, 'display') == 'none') {
            return true;
        }

        const tag = getTagOfNode(node);

        if (tag == 'DIV' || tag == 'SPAN') {
            // Empty SPAN/DIV or SPAN/DIV with only meaningless children is meaningless,
            // because it can render nothing. If we keep them here, there may be unexpected
            // LI elements added for those meaningless nodes.
            for (let child = node.firstChild; !!child; child = child.nextSibling) {
                if (!shouldSkipNode(child, ignoreSpace)) {
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
