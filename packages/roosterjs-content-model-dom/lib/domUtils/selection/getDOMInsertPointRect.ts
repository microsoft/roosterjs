import { isNodeOfType } from '../isNodeOfType';
import { normalizeRect } from '../normalizeRect';
import type { DOMInsertPoint, Rect } from 'roosterjs-content-model-types';

/**
 * Get bounding rect of the given DOM insert point
 * @param doc The document object
 * @param pos The input DOM insert point
 */
export function getDOMInsertPointRect(doc: Document, pos: DOMInsertPoint): Rect | null {
    let { node, offset } = pos;
    const range = doc.createRange();

    range.setStart(node, offset);

    // 1) try to get rect using range.getBoundingClientRect()
    let rect = normalizeRect(range.getBoundingClientRect());

    if (rect) {
        return rect;
    }

    // 2) Normalize this selection and try again
    // If selection is at beginning of a TEXT node, we will get node=text.parentNode and offset=0
    // This will move it down to the real text node
    while (node.lastChild) {
        if (offset == node.childNodes.length) {
            node = node.lastChild;
            offset = node.childNodes.length;
        } else {
            node = node.childNodes[offset];
            offset = 0;
        }
    }

    range.setStart(node, offset);
    range.setEnd(node, offset);
    rect = normalizeRect(range.getBoundingClientRect());

    if (rect) {
        return rect;
    }

    // 3) try to get rect using range.getClientRects
    const rects = range.getClientRects && range.getClientRects();
    rect = rects && rects.length == 1 ? normalizeRect(rects[0]) : null;
    if (rect) {
        return rect;
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
