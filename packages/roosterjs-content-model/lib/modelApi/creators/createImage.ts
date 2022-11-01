import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { ContentModelImageFormat } from '../../publicTypes/format/ContentModelImageFormat';
import { LinkFormat } from '../../publicTypes/format/formatParts/LinkFormat';

/**
 * @internal
 */
export function createImage(
    src: string,
    format?: ContentModelImageFormat,
    link?: LinkFormat
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
