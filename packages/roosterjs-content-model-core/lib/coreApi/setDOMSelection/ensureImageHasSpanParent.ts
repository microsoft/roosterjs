import { isElementOfType, isNodeOfType, wrap } from 'roosterjs-content-model-dom';

/**
 * @internal
 * Ensure image is wrapped by a span element
 * @param image
 * @returns the image
 */
export function ensureImageHasSpanParent(image: HTMLImageElement): HTMLImageElement {
    const parent = image.parentElement;

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
