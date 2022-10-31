import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ContentModelImageFormat } from '../../publicTypes/format/ContentModelImageFormat';
import { ContentModelLinkFormat } from '../../publicTypes/format/ContentModelLinkFormat';

/**
 * @internal
 */
export function createImage(
    src: string,
    format?: ContentModelImageFormat,
    link?: ContentModelLinkFormat
): ContentModelImage {
    const result: ContentModelImage = {
        segmentType: 'Image',
        src: src,
        format: format ? { ...format } : {},
    };

    if (link?.href) {
        result.link = { ...link };
    }

    return result;
}
