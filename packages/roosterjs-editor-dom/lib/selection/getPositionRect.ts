import createElement from '../utils/createElement';
import createRange from './createRange';
import normalizeRect from '../utils/normalizeRect';
import { NodeType } from 'roosterjs-editor-types';
import type { NodePosition, Rect } from 'roosterjs-editor-types';

/**
 * Get bounding rect of this position
 * @param position The position to get rect from
 */
export default function getPositionRect(position: NodePosition): Rect | null {
    if (!position) {
        return null;
    }

    let range = createRange(position);

    // 1) try to get rect using range.getBoundingClientRect()
    let rect: Rect | null =
        range.getBoundingClientRect && normalizeRect(range.getBoundingClientRect());

    if (rect) {
        return rect;
    }

    // 2) try to get rect using range.getClientRects
    position = position.normalize();
    const rects = range.getClientRects && range.getClientRects();
    rect = rects && rects.length == 1 ? normalizeRect(rects[0]) : null;
    if (rect) {
        return rect;
    }

    // 3) if node is text node, try inserting a SPAN and get the rect of SPAN for others
    if (position.node.nodeType == NodeType.Text && position.node.ownerDocument) {
        const span = createElement(
            { tag: 'span', children: ['\u200b'] },
            position.node.ownerDocument
        );
        range = createRange(position);
        range.insertNode(span!);
        rect = span!.getBoundingClientRect && normalizeRect(span!.getBoundingClientRect());
        span!.parentNode?.removeChild(span!);
        if (rect) {
            return rect;
        }
    }

    // 4) try getBoundingClientRect on element
    let element = position.element;
    if (element && element.getBoundingClientRect) {
        rect = normalizeRect(element.getBoundingClientRect());
        if (rect) {
            return rect;
        }
    }

    return null;
}
