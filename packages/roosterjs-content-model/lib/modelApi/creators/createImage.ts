import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ContentModelImageFormat } from '../../publicTypes/format/ContentModelImageFormat';

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
