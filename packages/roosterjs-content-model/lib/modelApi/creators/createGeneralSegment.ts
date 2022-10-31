import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelLinkFormat } from '../../publicTypes/format/ContentModelLinkFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createGeneralSegment(
    element: HTMLElement,
    format?: ContentModelSegmentFormat,
    link?: ContentModelLinkFormat
): ContentModelGeneralSegment {
    const result: ContentModelGeneralSegment = {
        blockType: 'BlockGroup',
        blockGroupType: 'General',
        segmentType: 'General',
        format: format ? { ...format } : {},
        blocks: [],
        element: element,
    };

    if (link?.href) {
        result.link = { ...link };
    }

    return result;
}
