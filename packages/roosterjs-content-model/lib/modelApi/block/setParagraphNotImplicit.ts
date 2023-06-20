import { ContentModelBlock } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setParagraphNotImplicit(block: ContentModelBlock) {
    if (block.blockType == 'Paragraph' && block.isImplicit) {
        block.isImplicit = false;
    }
}
