import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';

/**
 * @internal
 * Check if we can regenerate edited image from the source image.
 * An image can't regenerate result when there is CORS issue of the source content.
 * @param img The image element to test
 * @returns True when we can regenerate the edited image, otherwise false
 */
export function canRegenerateImage(img: HTMLImageElement | null): boolean {
    const image = img && isElementOfType(img, 'span') ? getWrappedImage(img) : img;
    // CHECK INSIDE WRAPPER
    if (!image) {
        return false;
    }

    try {
        const canvas = image.ownerDocument.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(image, 0, 0);
            context.getImageData(0, 0, 1, 1);
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

const getWrappedImage = (wrapper: HTMLSpanElement) => {
    const image = wrapper.firstElementChild;
    if (image && isNodeOfType(image, 'ELEMENT_NODE') && isElementOfType(image, 'img')) {
        return image;
    }
    return null;
};
