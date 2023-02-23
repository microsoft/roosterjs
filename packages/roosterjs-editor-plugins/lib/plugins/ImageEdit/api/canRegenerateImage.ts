/**
 * Check if we can regenerate edited image from the source image.
 * An image can't regenerate result when there is CORS issue of the source content.
 * @param img The image element to test
 * @returns True when we can regenerate the edited image, otherwise false
 */
export default function canRegenerateImage(img: HTMLImageElement): boolean {
    if (!img) {
        return false;
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
