import { ContentModelLinkFormat } from '../../publicTypes/format/ContentModelLinkFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';

/**
 * @internal
 */
export function createText(
    text: string,
    format?: ContentModelSegmentFormat,
    link?: ContentModelLinkFormat
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
