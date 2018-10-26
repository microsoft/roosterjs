import { NodeType } from 'roosterjs-editor-types';
import getTagOfNode from './getTagOfNode';

const VISIBLE_ELEMENT_TAGS = ['TABLE', 'IMG', 'LI'];
const VISIBLE_ELEMENT_SELECTOR = VISIBLE_ELEMENT_TAGS.join(',');
const ZERO_WIDTH_SPACE = /\u200b/g;

/**
 * Check if a given node has no visible content
 * @param node The node to check
 * @param trimContent Whether trim the text content so that spaces will be treated as empty.
 * Default value is false
 * @returns True if there isn't any visible element inside node, otherwise false
 */
export default function isNodeEmpty(node: Node, trimContent?: boolean) {
    if (!node) {
        return false;
    } else if (node.nodeType == NodeType.Text) {
        return trim(node.nodeValue, trimContent) == '';
    } else if (node.nodeType == NodeType.Element) {
        let element = node as Element;
        let textContent = trim(element.textContent, trimContent);
        if (
            textContent != '' ||
            VISIBLE_ELEMENT_TAGS.indexOf(getTagOfNode(element)) >= 0 ||
            element.querySelectorAll(VISIBLE_ELEMENT_SELECTOR)[0]
        ) {
            return false;
        }
    }
    return true;
}

function trim(s: string, trim: boolean) {
    s = s.replace(ZERO_WIDTH_SPACE, '');
    return trim ? s.trim() : s;
}
