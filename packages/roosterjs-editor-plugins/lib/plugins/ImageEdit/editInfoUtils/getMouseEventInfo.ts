/**
 * @internal
 * Get pageX of a MouseEvent.
 * For android WebViews e.pageX will be undefined, get info from TouchEvent instead
 * @param e
 * @returns pageX number
 */
export function getPageX(e: MouseEvent): number {
    let pageX = e.pageX;
    if (!pageX) {
        const touchEvent = e as unknown as TouchEvent;
        const touch = touchEvent.targetTouches[0];
        pageX = touch.pageX;
    }
    return pageX;
}

/**
 * @internal
 * Get pageY of a MouseEvent.
 * For android WebViews e.pageY will be undefined, get info from TouchEvent instead
 * @param e
 * @returns pageY number
 */
export function getPageY(e: MouseEvent): number {
    let pageY = e.pageY;
    if (!pageY) {
        const touchEvent = e as unknown as TouchEvent;
        const touch = touchEvent.targetTouches[0];
        pageY = touch.pageX;
    }
    return pageY;
}