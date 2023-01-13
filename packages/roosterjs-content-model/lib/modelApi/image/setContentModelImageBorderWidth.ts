import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';

/**
 * Set border width in px or pts to an image
 * @param image content model image
 * @param borderWidth the width in pixels or points
 * @internal
 */
export function setContentModelImageBorderWidth(image: ContentModelImage, borderWidth: string) {
    image.format.borderWidth = borderWidth;
    if (!image.format.borderStyle) {
        image.format.borderStyle = 'solid';
    }
}
