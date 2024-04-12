import { isNodeOfType } from 'roosterjs-content-model-dom';
import type { DOMInsertPoint } from 'roosterjs-content-model-types';

/**
 * HTML void elements
 * Per https://www.w3.org/TR/html/syntax.html#syntax-elements, cannot have child nodes
 * This regex is used when we move focus to very begin of editor. We should avoid putting focus inside
 * void elements so users don't accidentally create child nodes in them
 */
const HTML_VOID_ELEMENTS = [
    'AREA',
    'BASE',
    'BR',
    'COL',
    'COMMAND',
    'EMBED',
    'HR',
    'IMG',
    'INPUT',
    'KEYGEN',
    'LINK',
    'META',
    'PARAM',
    'SOURCE',
    'TRACK',
    'WBR',
];

/**
 * @internal
 */
export function normalizePos(node: Node, offset: number): DOMInsertPoint {
    const len = isNodeOfType(node, 'TEXT_NODE')
        ? node.nodeValue?.length ?? 0
        : node.childNodes.length;
    offset = Math.max(Math.min(offset, len), 0);

    while (node?.lastChild) {
        if (offset >= node.childNodes.length) {
            node = node.lastChild;
            offset = isNodeOfType(node, 'TEXT_NODE')
                ? node.nodeValue?.length ?? 0
                : node.childNodes.length;
        } else {
            const nextNode = node.childNodes[offset];

            if (
                isNodeOfType(nextNode, 'ELEMENT_NODE') &&
                HTML_VOID_ELEMENTS.indexOf(nextNode.tagName) >= 0
            ) {
                break;
            } else {
                node = node.childNodes[offset];
                offset = 0;
            }
        }
    }

    return { node, offset };
}
