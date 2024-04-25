import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import { MIN_HEIGHT_WIDTH } from '../constants/constants';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getPx(value: number): string {
    return value + 'px';
}

/**
 * @internal
 */
export function isASmallImage(widthPx: number, heightPx: number): boolean {
    return widthPx && heightPx && (widthPx < MIN_HEIGHT_WIDTH || heightPx < MIN_HEIGHT_WIDTH)
        ? true
        : false;
}

/**
 * @internal Calculate the rotated x and y distance for mouse moving
 * @param x Original x distance
 * @param y Original y distance
 * @param angle Rotated angle, in radian
 * @returns rotated x and y distances
 */
export function rotateCoordinate(x: number, y: number, angle: number): [number, number] {
    if (x == 0 && y == 0) {
        return [0, 0];
    }
    const hypotenuse = Math.sqrt(x * x + y * y);
    angle = Math.atan2(y, x) - angle;
    return [hypotenuse * Math.cos(angle), hypotenuse * Math.sin(angle)];
}

/**
 * @internal
 */
export function setFlipped(
    element: HTMLElement | null,
    flippedHorizontally?: boolean,
    flippedVertically?: boolean
) {
    if (element) {
        element.style.transform = `scale(${flippedHorizontally ? -1 : 1}, ${
            flippedVertically ? -1 : 1
        })`;
    }
}

/**
 * @internal
 */
export function setWrapperSizeDimensions(
    wrapper: HTMLElement,
    image: HTMLImageElement,
    width: number,
    height: number
) {
    const hasBorder = image.style.borderStyle;
    if (hasBorder) {
        const borderWidth = image.style.borderWidth ? 2 * parseInt(image.style.borderWidth) : 2;
        wrapper.style.width = getPx(width + borderWidth);
        wrapper.style.height = getPx(height + borderWidth);
        return;
    }
    wrapper.style.width = getPx(width);
    wrapper.style.height = getPx(height);
}

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

/**
 * @internal
 * Check if the current image was resized by the user
 * @param image the current image
 * @returns if the user resized the image, returns true, otherwise, returns false
 */
export function checkIfImageWasResized(image: HTMLImageElement): boolean {
    const { style } = image;
    const isMaxWidthInitial =
        style.maxWidth === '' || style.maxWidth === 'initial' || style.maxWidth === 'auto';
    if (
        isMaxWidthInitial &&
        (isFixedNumberValue(style.height) || isFixedNumberValue(style.width))
    ) {
        return true;
    } else {
        return false;
    }
}

/**
 * @internal
 */
export const isRTL = (editor: IEditor) => {
    const model = editor.getContentModelCopy('disconnected');
    const paragraph = getSelectedSegmentsAndParagraphs(
        model,
        false /** includingFormatHolder */
    )[0][1];
    return paragraph?.format?.direction === 'rtl';
};

function isFixedNumberValue(value: string | number) {
    const numberValue = typeof value === 'string' ? parseInt(value) : value;
    return !isNaN(numberValue);
}
