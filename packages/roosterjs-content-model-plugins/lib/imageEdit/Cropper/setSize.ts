import { getPx } from '../utils/getPx';

/**
 * @internal
 */
export function setSize(
    element: HTMLElement,
    left: number | undefined,
    top: number | undefined,
    right: number | undefined,
    bottom: number | undefined,
    width: number | undefined,
    height: number | undefined
) {
    element.style.left = left !== undefined ? getPx(left) : element.style.left;
    element.style.top = top !== undefined ? getPx(top) : element.style.top;
    element.style.right = right !== undefined ? getPx(right) : element.style.right;
    element.style.bottom = bottom !== undefined ? getPx(bottom) : element.style.bottom;
    element.style.width = width !== undefined ? getPx(width) : element.style.width;
    element.style.height = height !== undefined ? getPx(height) : element.style.height;
}
