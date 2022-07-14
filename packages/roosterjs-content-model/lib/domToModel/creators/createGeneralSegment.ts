import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { FormatContext } from '../types/FormatContext';

/**
 * @internal
 */
export function createGeneralSegment(
    context: FormatContext,
    element: HTMLElement
): ContentModelGeneralSegment {
    const result: ContentModelGeneralSegment = {
        segmentType: ContentModelSegmentType.General,
        blocks: [],
        node: element,
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.General,
    };

    if (context.isInSelection) {
        result.isSelected = true;
    }

    return result;
}
