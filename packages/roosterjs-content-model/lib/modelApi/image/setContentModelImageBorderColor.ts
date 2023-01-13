import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';

/**
 * @internal
 */
export function setContentModelImageBorderColor(image: ContentModelImage, color: string) {
    image.format.borderColor = color;
    if (!image.format.borderStyle) {
        image.format.borderStyle = 'solid';
    }
}
