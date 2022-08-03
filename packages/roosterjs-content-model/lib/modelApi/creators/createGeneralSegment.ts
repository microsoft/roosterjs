import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';

/**
 * @internal
 */
export function createGeneralSegment(element: HTMLElement): ContentModelGeneralSegment {
    return {
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.General,
        segmentType: ContentModelSegmentType.General,
        blocks: [],
        element: element,
    };
}
