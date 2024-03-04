import type { ContentModelGeneralBlock } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelGeneralBlock model
 * @param element Original element of this model
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
