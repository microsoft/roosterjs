import { isNodeOfType } from 'roosterjs-content-model-dom';
import type { DOMInsertPoint } from 'roosterjs-content-model-types';

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
            node = node.childNodes[offset];
            offset = 0;
        }
    }

    return { node, offset };
}
