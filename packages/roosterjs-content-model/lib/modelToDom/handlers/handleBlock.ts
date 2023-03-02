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
    function callHandler<T extends ContentModelBlock>(
        block: T,
        handler: ContentModelBlockHandler<T>
    ) {
        handler(doc, parent, block, context, refNode);
    }

    const handlers = context.modelHandlers;

    switch (block.blockType) {
        case 'Table':
            callHandler(block, handlers.table);
            break;
        case 'Paragraph':
            callHandler(block, handlers.paragraph);
            break;
        case 'Entity':
            callHandler(block, handlers.entity);
            break;
        case 'Divider':
            callHandler(block, handlers.divider);
            break;
        case 'BlockGroup':
            switch (block.blockGroupType) {
                case 'General':
                    callHandler(block, handlers.general);
                    break;

                case 'Quote':
                    callHandler(block, handlers.quote);
                    break;

                case 'ListItem':
                    callHandler(block, handlers.listItem);
                    break;
            }

            break;
    }
};
