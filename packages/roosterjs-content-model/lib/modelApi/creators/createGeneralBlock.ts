import { ContentModelGeneralBlock } from '../../publicTypes/block/group/ContentModelGeneralBlock';

/**
 * @internal
 */
export function createGeneralBlock(element: HTMLElement): ContentModelGeneralBlock {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'General',
        element: element,
        blocks: [],
    };
}
