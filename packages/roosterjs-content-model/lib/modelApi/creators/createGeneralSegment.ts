import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createGeneralSegment(
    element: HTMLElement,
    format?: ContentModelSegmentFormat
): ContentModelGeneralSegment {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'General',
        segmentType: 'General',
        format: format ? { ...format } : {},
        blocks: [],
        element: element,
    };
}
