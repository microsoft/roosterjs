import { NodeType } from 'roosterjs-editor-types';
const VISIBLE_ELEMENT_SELECTORS = ['table', 'img', 'li'];
const ZERO_WIDTH_SPACE = '\u200b';

/**
 * Check if a given node has visible content
 */
export default function isNodeEmpty(node: Node, trim?: boolean) {
    let trimmer = trim ? (text: string) => text.trim() : (text: string) => text;
    if (node.nodeType == NodeType.Text) {
        return trimmer((node as Text).data) == '';
    } else if (node.nodeType == NodeType.Element) {
        let element = node as Element;
        let textContent = trimmer(element.textContent);
        if (textContent != '' && textContent != ZERO_WIDTH_SPACE) {
            return false;
        }
        for (let selector of VISIBLE_ELEMENT_SELECTORS) {
            if (element.querySelectorAll(selector).length > 0) {
                return false;
            }
        }
    }
    return true;
}
