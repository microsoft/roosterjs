import { ContentModelGeneralBlock } from '../../publicTypes/group/ContentModelGeneralBlock';

/**
 * @internal
 */
export function createGeneralBlock(element: HTMLElement): ContentModelGeneralBlock {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'General',
        element: element,
        blocks: [],
        format: {},
    };
}
