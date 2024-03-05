import { isNodeOfType } from 'roosterjs-content-model-dom';
import { Rect } from 'roosterjs-content-model-types';

/**
 * Get bounding rect of this position
 * @param position The position to get rect from
 */
export function getPositionRect(container: Node, offset: number): Rect | null {
    let range = container.ownerDocument.createRange();

    range.setStart(container, offset);

    // 1) try to get rect using range.getBoundingClientRect()
    let rect = normalizeRect(range.getBoundingClientRect());

    if (rect) {
        return rect;
    }

    // 2) try to get rect using range.getClientRects
    while (container.lastChild) {
        if (offset == container.childNodes.length) {
            container = container.lastChild;
            offset = container.childNodes.length;
        } else {
            container = container.childNodes[offset];
            offset = 0;
        }
    }

    const rects = range.getClientRects && range.getClientRects();
    rect = rects && rects.length == 1 ? normalizeRect(rects[0]) : null;
    if (rect) {
        return rect;
    }

    // 3) if node is text node, try inserting a SPAN and get the rect of SPAN for others
    if (isNodeOfType(container, 'TEXT_NODE')) {
        const span = container.ownerDocument.createElement('span');

        span.textContent = '\u200b';
        range.insertNode(span);
        rect = normalizeRect(span.getBoundingClientRect());
        span.parentNode.removeChild(span);

        if (rect) {
            return rect;
        }
    }

    // 4) try getBoundingClientRect on element
    if (isNodeOfType(container, 'ELEMENT_NODE') && container.getBoundingClientRect) {
        rect = normalizeRect(container.getBoundingClientRect());

        if (rect) {
            return rect;
        }
    }

    return null;
}

function normalizeRect(clientRect: DOMRect): Rect | null {
    const { left, right, top, bottom } =
        clientRect || <DOMRect>{ left: 0, right: 0, top: 0, bottom: 0 };
    return left === 0 && right === 0 && top === 0 && bottom === 0
        ? null
        : {
              left: Math.round(left),
              right: Math.round(right),
              top: Math.round(top),
              bottom: Math.round(bottom),
          };
}
