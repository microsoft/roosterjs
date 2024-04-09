import { DOMInsertPoint, Rect } from 'roosterjs-content-model-types';
import { isNodeOfType, normalizeRect } from 'roosterjs-content-model-dom';

/**
 * Get bounding rect of the given DOM insert point
 * @param doc The document object
 * @param pos The input DOM insert point
 */
export function getDOMInsertPointRect(doc: Document, pos: DOMInsertPoint): Rect | null {
    let { node, offset } = pos;
    let range = doc.createRange();

    range.setStart(node, offset);

    // 1) try to get rect using range.getBoundingClientRect()
    let rect = normalizeRect(range.getBoundingClientRect());

    if (rect) {
        return rect;
    }

    // 2) try to get rect using range.getClientRects
    while (node.lastChild) {
        if (offset == node.childNodes.length) {
            node = node.lastChild;
            offset = node.childNodes.length;
        } else {
            node = node.childNodes[offset];
            offset = 0;
        }
    }

    const rects = range.getClientRects && range.getClientRects();
    rect = rects && rects.length == 1 ? normalizeRect(rects[0]) : null;
    if (rect) {
        return rect;
    }

    // 3) if node is text node, try inserting a SPAN and get the rect of SPAN for others
    if (isNodeOfType(node, 'TEXT_NODE')) {
        const span = node.ownerDocument.createElement('span');

        span.textContent = '\u200b';
        range.insertNode(span);
        rect = normalizeRect(span.getBoundingClientRect());
        span.parentNode?.removeChild(span);

        if (rect) {
            return rect;
        }
    }

    // 4) try getBoundingClientRect on element
    if (isNodeOfType(node, 'ELEMENT_NODE') && node.getBoundingClientRect) {
        rect = normalizeRect(node.getBoundingClientRect());

        if (rect) {
            return rect;
        }
    }

    return null;
}
