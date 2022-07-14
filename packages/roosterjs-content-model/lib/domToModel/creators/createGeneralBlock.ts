import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';
import { FormatContext } from '../types/FormatContext';

/**
 * @internal
 */
export function createGeneralBlock(
    context: FormatContext,
    element: HTMLElement
): ContentModelGeneralBlock {
    return {
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.General,
        node: element,
        blocks: [],
    };
}
