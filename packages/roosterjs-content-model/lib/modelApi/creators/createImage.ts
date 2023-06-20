import { ContentModelImage, ContentModelImageFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createImage(src: string, format?: ContentModelImageFormat): ContentModelImage {
    return {
        segmentType: 'Image',
        src: src,
        format: format ? { ...format } : {},
        dataset: {},
    };
}
