import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';

/**
 * @internal
 */
export function setContentModelImageBorderStyle(image: ContentModelImage, style: string) {
    image.format.borderStyle = style;
}
