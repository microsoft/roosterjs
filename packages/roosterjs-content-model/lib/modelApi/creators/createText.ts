import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { LinkFormat } from '../../publicTypes/format/formatParts/LinkFormat';

/**
 * @internal
 */
export function createText(
    text: string,
    format?: ContentModelSegmentFormat,
    link?: LinkFormat
): ContentModelText {
    const result: ContentModelText = {
        segmentType: 'Text',
        text: text,
        format: format ? { ...format } : {},
    };

    if (link?.href) {
        result.link = { ...link };
    }

    return result;
}
