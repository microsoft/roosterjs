import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { LinkFormat } from '../../publicTypes/format/formatParts/LinkFormat';

/**
 * @internal
 */
export function createGeneralSegment(
    element: HTMLElement,
    format?: ContentModelSegmentFormat,
    link?: LinkFormat
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
