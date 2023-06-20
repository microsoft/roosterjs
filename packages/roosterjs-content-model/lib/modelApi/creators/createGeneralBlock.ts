import { ContentModelGeneralBlock } from 'roosterjs-content-model-types';

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
