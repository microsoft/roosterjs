/**
 * @internal
 * Check if we can regenerate edited image from the source image.
 * An image can't regenerate result when there is CORS issue of the source content.
 * @param img The image element to test
 * @param resolveImageSource Optional callback to resolve an image `src` into a canvas-safe URL (e.g., a data URL).
 * @returns True when we can regenerate the edited image, otherwise false
 */
export function canRegenerateImage(
    img: HTMLImageElement | null,
    resolveImageSource?: (src: string) => string | undefined
): boolean {
    if (!img) {
        return false;
    }

    // If a resolveImageSource callback is provided, the image source should be resolved to a
    // canvas-compatible URL when editing starts, so we can assume the image can be regenerated.
    if (resolveImageSource && img.src) {
        const resolved = resolveImageSource(img.src);
        if (resolved && resolved !== img.src) {
            return true;
        }
    }

    try {
        const canvas = img.ownerDocument.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(img, 0, 0);
            context.getImageData(0, 0, 1, 1);
            return true;
        }

        return false;
    } catch {
        return false;
    }
}
