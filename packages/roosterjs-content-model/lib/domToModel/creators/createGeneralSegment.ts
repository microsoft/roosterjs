import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelGeneralSegment } from '../../publicTypes/segment/ContentModelGeneralSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { DomToModelContext } from '../context/DomToModelContext';

/**
 * @internal
 */
export function createGeneralSegment(
    element: HTMLElement,
    context: DomToModelContext
): ContentModelGeneralSegment {
    const result: ContentModelGeneralSegment = {
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.General,
        segmentType: ContentModelSegmentType.General,
        blocks: [],
        element: element,
    };

    if (context.isInSelection) {
        result.isSelected = true;
    }

    return result;
}
