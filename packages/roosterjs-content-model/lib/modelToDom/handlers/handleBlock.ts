import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleBlock: ContentModelBlockHandler<ContentModelBlock> = (
    doc: Document,
    parent: Node,
    block: ContentModelBlock,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    const handlers = context.modelHandlers;

    switch (block.blockType) {
        case 'Table':
            refNode = handlers.table(doc, parent, block, context, refNode);
            break;
        case 'Paragraph':
            refNode = handlers.paragraph(doc, parent, block, context, refNode);
            break;
        case 'Entity':
            refNode = handlers.entity(doc, parent, block, context, refNode);
            break;
        case 'Divider':
            refNode = handlers.divider(doc, parent, block, context, refNode);
            break;
        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'General':
                    refNode = handlers.general(doc, parent, block, context, refNode);
                    break;

                case 'FormatContainer':
                    refNode = handlers.formatContainer(doc, parent, block, context, refNode);
                    break;

                case 'ListItem':
                    refNode = handlers.listItem(doc, parent, block, context, refNode);
                    break;
            }

            break;
    }

    return refNode;
};
