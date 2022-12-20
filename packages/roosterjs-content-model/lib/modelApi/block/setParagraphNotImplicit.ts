import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';

/**
 * @internal
 */
export function setParagraphNotImplicit(block: ContentModelBlock) {
    if (block.blockType == 'Paragraph' && block.isImplicit) {
        block.isImplicit = false;
    }
}
