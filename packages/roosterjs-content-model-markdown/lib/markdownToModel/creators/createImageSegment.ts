import { createImage } from 'roosterjs-content-model-dom';
import type { ContentModelImage, ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createImageSegment(textSegment: ContentModelText): ContentModelImage | undefined {
    const imageRegex = /\!\[([^\[]+)\]\((https?:\/\/[^\)]+)\)/g;
    const text = textSegment.text;
    const markdownImage = imageRegex.exec(text);
    if (markdownImage) {
        const image = createImage(markdownImage[2]);
        image.alt = markdownImage[1];
        return image;
    }
    return;
}
