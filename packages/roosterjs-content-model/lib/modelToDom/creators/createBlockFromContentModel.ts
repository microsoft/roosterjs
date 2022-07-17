import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { createParagraph } from './createParagraph';

/**
 * @internal
 */
export function createBlockFromContentModel(doc: Document, parent: Node, block: ContentModelBlock) {
    switch (block.blockType) {
        case ContentModelBlockType.BlockGroup:
            let newParent = parent;

            switch (block.blockGroupType) {
                case ContentModelBlockGroupType.General:
                    newParent = block.element.cloneNode();
                    parent.appendChild(newParent);
                    break;
                default:
                    break;
            }

            block.blocks.forEach(childBlock =>
                createBlockFromContentModel(doc, newParent, childBlock)
            );

            break;
        case ContentModelBlockType.Paragraph:
            createParagraph(doc, parent, block);
            break;
    }
}
