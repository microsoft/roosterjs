import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { setContentModelImageDefaultBorder } from './setContentModelImageDefaultBorder';

/**
 * Set border width in px or pts to an image
 * @param image content model image
 * @param borderWidth the width in pixels or points
 * @param isPt if the image is in pt
 * @internal
 */
export function setContentModelImageBorderWidth(
    image: ContentModelImage,
    borderWidth: string,
    isPt: boolean = false
) {
    image.format.borderWidth = isPt ? calculateBorderWidth(borderWidth) : borderWidth;
    setContentModelImageDefaultBorder(image);
}

function calculateBorderWidth(borderWidth: string): string {
    const width = parseInt(borderWidth);
    const pxWidth = width * (72 / 96);
    return pxWidth + 'px';
}
