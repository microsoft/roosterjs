import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { handleBlockGroup } from './handleBlockGroup';
import { handleParagraph } from './handleParagraph';
import { handleTable } from './handleTable';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleBlock: ContentModelHandler<ContentModelBlock> = (
    doc: Document,
    parent: Node,
    block: ContentModelBlock,
    context: ModelToDomContext
) => {
    switch (block.blockType) {
        case 'Table':
            context.modelHandlers.table(doc, parent, block, context);
            break;
        case 'BlockGroup':
            handleBlockGroup(doc, parent, block, context);
            break;
        case 'Paragraph':
            context.modelHandlers.paragraph(doc, parent, block, context);
            break;
        case 'Entity':
            context.modelHandlers.entity(doc, parent, block, context);
            break;
        case 'Divider':
            context.modelHandlers.divider(doc, parent, block, context);
            break;
    }
}
