import { createImage } from 'roosterjs-content-model-dom';
import type { ContentModelImage } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createImageSegment(text: string, url: string): ContentModelImage {
    const image = createImage(url);
    image.alt = text;
    return image;
}
