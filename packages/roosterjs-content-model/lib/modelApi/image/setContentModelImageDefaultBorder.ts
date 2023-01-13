import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';

/**
 * @internal
 */
export function setContentModelImageDefaultBorder(image: ContentModelImage) {
    if (!image.format.borderStyle) {
        image.format.borderStyle = 'solid';
    }
    if (!image.format.borderRadius) {
        image.format.borderRadius = '5px';
    }
    if (!image.format.borderWidth) {
        image.format.borderWidth = '1px';
    }
}
