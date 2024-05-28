import { isElementOfType } from './isElementOfType';
import { isNodeOfType } from './isNodeOfType';
import { wrap } from './wrap';

/**
 * Ensure image is wrapped by a span element
 * @param image
 * @returns the image
 */
export function ensureImageHasSpanParent(
    image: HTMLImageElement,
    entryPoint?: string
): HTMLImageElement {
    const parent = image.parentElement;
    // console.log(parent, entryPoint);
    if (
        parent &&
        isNodeOfType(parent, 'ELEMENT_NODE') &&
        isElementOfType(parent, 'span') &&
        parent.firstChild == image &&
        parent.lastChild == image
    ) {
        return image;
    }

    wrap(image.ownerDocument, image, 'span');
    return image;
}
