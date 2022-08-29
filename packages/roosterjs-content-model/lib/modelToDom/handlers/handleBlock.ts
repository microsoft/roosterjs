import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { handleParagraph } from './handleParagraph';
import { handleTable } from './handleTable';
import { ModelToDomContext } from '../context/ModelToDomContext';

/**
 * @internal
 */
export function handleBlock(
    doc: Document,
    parent: Node,
    block: ContentModelBlock,
    context: ModelToDomContext
) {
    switch (block.blockType) {
        case 'Table':
            handleTable(doc, parent, block, context);
            break;

        case 'BlockGroup':
            let newParent = parent;

            switch (block.blockGroupType) {
                case 'General':
                    newParent = block.element.cloneNode();
                    parent.appendChild(newParent);
                    break;
                default:
                    break;
            }

            block.blocks.forEach(childBlock => handleBlock(doc, newParent, childBlock, context));

            break;
        case 'Paragraph':
            handleParagraph(doc, parent, block, context);
            break;
    }
}
