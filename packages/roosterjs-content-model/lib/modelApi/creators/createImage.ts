import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createImage(src: string, format?: ContentModelSegmentFormat): ContentModelImage {
    return {
        segmentType: 'Image',
        src: src,
        format: format ? { ...format } : {},
    };
}
