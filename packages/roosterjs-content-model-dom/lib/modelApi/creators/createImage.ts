import type { ContentModelImage, ContentModelImageFormat } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelImage model
 * @param src Image source
 * @param format @optional The format of this model
 */
export function createImage(src: string, format?: ContentModelImageFormat): ContentModelImage {
    return {
        segmentType: 'Image',
        src: src,
        format: format ? { ...format } : {},
        dataset: {},
    };
}
