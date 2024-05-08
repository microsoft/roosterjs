import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelGeneralBlock model
 * @param element Original element of this model
 */
export function createGeneralBlock(element: HTMLElement): ContentModelGeneralBlock {
    const result: ReadonlyContentModelGeneralBlock = {
        blockType: 'BlockGroup',
        blockGroupType: 'General',
        element: element,
        blocks: [],
        format: {},
    };

    return internalConvertToMutableType(result);
}
