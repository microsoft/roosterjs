import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';

/**
 * @internal
 */
export function setContentModelImageBoxShadow(image: ContentModelImage, boxShadow: string) {
    image.format.boxShadow = boxShadow;
}
