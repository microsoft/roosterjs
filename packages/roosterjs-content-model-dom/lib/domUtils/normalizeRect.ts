import type { Rect } from 'roosterjs-content-model-types';

/**
 * A ClientRect of all 0 is possible. i.e. chrome returns a ClientRect of 0 when the cursor is on an empty p
 * We validate that and only return a rect when the passed in ClientRect is valid
 * @param clientRect Client rect object normally retrieved from getBoundingClientRect function
 */
export function normalizeRect(clientRect: DOMRect): Rect | null {
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
