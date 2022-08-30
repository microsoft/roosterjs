import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';

/**
 * @internal
 */
export function createGeneralSegment(element: HTMLElement): ContentModelGeneralSegment {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'General',
        segmentType: 'General',
        blocks: [],
        element: element,
    };
}
