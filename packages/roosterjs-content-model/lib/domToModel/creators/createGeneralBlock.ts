import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';

/**
 * @internal
 */
export function createGeneralBlock(element: HTMLElement): ContentModelGeneralBlock {
    return {
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.General,
        element: element,
        blocks: [],
    };
}
