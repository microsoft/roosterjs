import { ContentModelBlock } from 'roosterjs-content-model-types';

/**
 * For a given block, if it is a paragraph, set it to be not-implicit
 * @param block The block to check
 */
export function setParagraphNotImplicit(block: ContentModelBlock) {
    if (block.blockType == 'Paragraph' && block.isImplicit) {
        block.isImplicit = false;
    }
}
