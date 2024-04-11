import { MIN_HEIGHT_WIDTH } from '../constants/constants';

/**
 * @internal
 */
export function isASmallImage(widthPx: number, heightPx: number): boolean {
    return widthPx && heightPx && (widthPx < MIN_HEIGHT_WIDTH || heightPx < MIN_HEIGHT_WIDTH)
        ? true
        : false;
}
