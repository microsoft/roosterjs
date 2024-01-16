import type {
    ContentModelBlock,
    ContentModelBlockHandler,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

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
            refNode = handlers.entityBlock(doc, parent, block, context, refNode);
            break;
        case 'Divider':
            refNode = handlers.divider(doc, parent, block, context, refNode);
            break;
        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'General':
                    refNode = handlers.generalBlock(doc, parent, block, context, refNode);
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
