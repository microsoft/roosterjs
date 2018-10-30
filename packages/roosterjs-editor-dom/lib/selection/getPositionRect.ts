import Position from './Position';
import createRange from './createRange';
import getElementOrParentElement from '../utils/getElementOrParentElement';
import { NodeType, Rect } from 'roosterjs-editor-types';

/**
 * Get bounding rect of this position
 * @param position The positioin to get rect from
 */
export default function getPositionRect(position: Position): Rect {
    if (!position) {
        return null;
    }

    let range = createRange(position);

    // 1) try to get rect using range.getBoundingClientRect()
    let rect = range.getBoundingClientRect && normalizeRect(range.getBoundingClientRect());

    if (rect) {
        return rect;
    }

    // 2) try to get rect using range.getClientRects
    position = position.normalize();
    const rects = range.getClientRects && range.getClientRects();
    rect = rects && rects.length == 1 && normalizeRect(rects[0]);
    if (rect) {
        return rect;
    }

    // 3) if node is text node, try inserting a SPAN and get the rect of SPAN for others
    if (position.node.nodeType == NodeType.Text) {
        let span = document.createElement('SPAN');
        span.innerHTML = '\u200b';
        range = createRange(position);
        range.insertNode(span);
        rect = span.getBoundingClientRect && normalizeRect(span.getBoundingClientRect());
        span.parentNode.removeChild(span);
        if (rect) {
            return rect;
        }
    }

    // 4) try getBoundingClientRect on element
    let element = getElementOrParentElement(position.node);
    if (element && element.getBoundingClientRect) {
        rect = normalizeRect(element.getBoundingClientRect());
        if (rect) {
            return rect;
        }
    }

    return null;
}

function normalizeRect(clientRect: ClientRect): Rect {
    // A ClientRect of all 0 is possible. i.e. chrome returns a ClientRect of 0 when the cursor is on an empty p
    // We validate that and only return a rect when the passed in ClientRect is valid
    let { left, right, top, bottom } = clientRect || <ClientRect>{};
    return left + right + top + bottom > 0
        ? {
              left: Math.round(left),
              right: Math.round(right),
              top: Math.round(top),
              bottom: Math.round(bottom),
          }
        : null;
}
