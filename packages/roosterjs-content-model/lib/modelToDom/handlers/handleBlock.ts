import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { handleBlockGroup } from './handleBlockGroup';
import { handleParagraph } from './handleParagraph';
import { handleTable } from './handleTable';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

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
            handleBlockGroup(doc, parent, block, context);
            break;
        case 'Paragraph':
            handleParagraph(doc, parent, block, context);
            break;
    }
}
