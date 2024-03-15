import { normalizeRect } from 'roosterjs-content-model-dom';
import type { GetVisibleViewport, Rect } from 'roosterjs-content-model-types';

/**
 * @internal
 * Retrieves the rect of the visible viewport of the editor.
 * @param core The EditorCore object
 */
export const getVisibleViewport: GetVisibleViewport = core => {
    const scrollContainer = core.domEvent.scrollContainer;

    return getIntersectedRect(
        scrollContainer == core.physicalRoot
            ? [scrollContainer]
            : [scrollContainer, core.physicalRoot]
    );
};

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
function getIntersectedRect(elements: HTMLElement[], additionalRects: Rect[] = []): Rect | null {
    const rects = elements
        .map(element => normalizeRect(element.getBoundingClientRect()))
        .concat(additionalRects)
        .filter((rect: Rect | null): rect is Rect => !!rect);

    const result: Rect = {
        top: Math.max(...rects.map(r => r.top)),
        bottom: Math.min(...rects.map(r => r.bottom)),
        left: Math.max(...rects.map(r => r.left)),
        right: Math.min(...rects.map(r => r.right)),
    };

    return result.top < result.bottom && result.left < result.right ? result : null;
}
