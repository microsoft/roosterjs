import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { setContentModelImageDefaultBorder } from './setContentModelImageDefaultBorder';

/**
 * @internal
 */
export function setContentModelImageBorderColor(image: ContentModelImage, color: string) {
    image.format.borderColor = color;
    setContentModelImageDefaultBorder(image);
}
