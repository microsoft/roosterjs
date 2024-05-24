import { mutateBlock } from '../common/mutate';
import type { ReadonlyContentModelBlock } from 'roosterjs-content-model-types';

/**
 * For a given block, if it is a paragraph, set it to be not-implicit
 * @param block The block to check
 */
export function setParagraphNotImplicit(block: ReadonlyContentModelBlock) {
    if (block.blockType == 'Paragraph' && block.isImplicit) {
        mutateBlock(block).isImplicit = false;
    }
}
