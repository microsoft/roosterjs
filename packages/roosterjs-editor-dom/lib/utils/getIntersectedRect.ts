import normalizeRect from './normalizeRect';
import { Rect } from 'roosterjs-editor-types';

/**
 * Get the intersected Rect of elements provided
 *
 * @example
 * The result of the following Elements Rects would be:
    {
        top: Element2.top,
        bottom: Element1.bottom,
        left: Element2.left,
        right: Element2.right
    }
    +-------------------------+
    | Element 1               |
    |   +-----------------+   |
    |   | Element2        |   |
    |   |                 |   |
    |   |                 |   |
    +-------------------------+
        |                 |
        +-----------------+

 * @param elements Elements to use.
 * @param additionalRects additional rects to use
 * @returns If the Rect is valid return the rect, if not, return null.
 */
export default function getIntersectedRect(
    elements: HTMLElement[],
    additionalRects: Rect[] = []
): Rect | null {
    const rects = elements
        .map(element => normalizeRect(element.getBoundingClientRect()))
        .concat(additionalRects)
        .filter(element => !!element) as Rect[];

    const result: Rect = {
        top: Math.max(...rects.map(r => r.top)),
        bottom: Math.min(...rects.map(r => r.bottom)),
        left: Math.max(...rects.map(r => r.left)),
        right: Math.min(...rects.map(r => r.right)),
    };

    return result.top < result.bottom && result.left < result.right ? result : null;
}
