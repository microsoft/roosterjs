import getTagOfNode from './getTagOfNode';
import { NodeType } from 'roosterjs-editor-types';

const VISIBLE_ELEMENT_TAGS = ['IMG'];
const VISIBLE_CHILD_ELEMENT_SELECTOR = ['TABLE', 'IMG', 'LI'].join(',');
const ZERO_WIDTH_SPACE = /\u200b/g;

/**
 * Check if a given node has no visible content
 * @param node The node to check
 * @param trimContent Whether trim the text content so that spaces will be treated as empty.
 * Default value is false
 * @returns True if there isn't any visible element inside node, otherwise false
 */
export default function isNodeEmpty(
    node: Node,
    trimContent?: boolean,
    shouldCountBrAsVisible?: boolean
) {
    if (!node) {
        return false;
    } else if (node.nodeType == NodeType.Text) {
        return trim(node.nodeValue || '', trimContent) == '';
    } else if (node.nodeType == NodeType.Element) {
        let element = node as Element;
        let textContent = trim(element.textContent || '', trimContent);
        const visibleSelector = shouldCountBrAsVisible
            ? `${VISIBLE_CHILD_ELEMENT_SELECTOR},BR`
            : VISIBLE_CHILD_ELEMENT_SELECTOR;
        if (
            textContent != '' ||
            VISIBLE_ELEMENT_TAGS.indexOf(getTagOfNode(element)) >= 0 ||
            element.querySelectorAll(visibleSelector)[0]
        ) {
            return false;
        }
    }
    return true;
}

function trim(s: string, trim: boolean | undefined) {
    s = s.replace(ZERO_WIDTH_SPACE, '');
    return trim ? s.trim() : s;
}
