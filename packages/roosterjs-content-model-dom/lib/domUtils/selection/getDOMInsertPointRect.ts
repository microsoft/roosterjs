import { isNodeOfType } from '../isNodeOfType';
import { normalizeRect } from '../normalizeRect';
import type { DOMInsertPoint, Rect } from 'roosterjs-content-model-types';

/**
 * Get bounding rect of the given DOM insert point
 * @param doc The document object
 * @param pos The input DOM insert point
 */
export function getDOMInsertPointRect(doc: Document, pos: DOMInsertPoint): Rect | null {
    const range = doc.createRange();

    return (
        tryGetRectFromPos(pos, range) ?? // 1. try get from the pos directly using getBoundingClientRect or getClientRects
        tryGetRectFromPos((pos = normalizeInsertPoint(pos)), range) ?? // 2. try get normalized pos, this can work when insert point is inside text node
        tryGetRectFromNode(pos.node) // 3. fallback to node rect using getBoundingClientRect
    );
}

function normalizeInsertPoint(pos: DOMInsertPoint) {
    let { node, offset } = pos;

    while (node.lastChild) {
        if (offset == node.childNodes.length) {
            node = node.lastChild;
            offset = node.childNodes.length;
        } else {
            node = node.childNodes[offset];
            offset = 0;
        }
    }

    return { node, offset };
}

function tryGetRectFromPos(pos: DOMInsertPoint, range: Range): Rect | null {
    let { node, offset } = pos;

    range.setStart(node, offset);
    range.setEnd(node, offset);

    const rect = normalizeRect(range.getBoundingClientRect());

    if (rect) {
        return rect;
    } else {
        const rects = range.getClientRects && range.getClientRects();

        return rects && rects.length == 1 ? normalizeRect(rects[0]) : null;
    }
}

function tryGetRectFromNode(node: Node) {
    return isNodeOfType(node, 'ELEMENT_NODE') && node.getBoundingClientRect
        ? normalizeRect(node.getBoundingClientRect())
        : null;
}
