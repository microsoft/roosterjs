import { applyFormat } from '../utils/applyFormat';
import { listItemMetadataFormatHandler } from '../../formatHandlers/list/listItemMetadataFormatHandler';
import { setParagraphNotImplicit } from '../../modelApi/block/setParagraphNotImplicit';
import { unwrap } from 'roosterjs-editor-dom';
import { updateListMetadata } from '../../domUtils/metadata/updateListMetadata';
import type {
    ContentModelBlockHandler,
    ContentModelListItem,
    ModelToDomContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleListItem: ContentModelBlockHandler<ContentModelListItem> = (
    doc: Document,
    parent: Node,
    listItem: ContentModelListItem,
    context: ModelToDomContext,
    refNode: Node | null
) => {
    refNode = context.modelHandlers.list(doc, parent, listItem, context, refNode);

    const { nodeStack } = context.listFormat;

    let listParent = nodeStack?.[nodeStack?.length - 1]?.node || parent;
    const li = doc.createElement('li');
    const level = listItem.levels[listItem.levels.length - 1];

    // It is possible listParent is the same with parent param.
    // This happens when outdent a list item to cause it has no list level
    listParent.insertBefore(li, refNode?.parentNode == listParent ? refNode : null);

    if (level) {
        applyFormat(li, context.formatAppliers.listItemElement, listItem.format, context);
        applyFormat(li, context.formatAppliers.segment, listItem.formatHolder.format, context);
        applyFormat(li, context.formatAppliers.listItem, level.format, context);

        // TODO: Move this out into roosterjs-content-model-editor package
        updateListMetadata(level, metadata => {
            applyFormat(li, [listItemMetadataFormatHandler.apply], metadata || {}, context);

            return metadata;
        });

        context.modelHandlers.blockGroupChildren(doc, li, listItem, context);
    } else {
        // There is no level for this list item, that means it should be moved out of the list
        // For each paragraph, make it not implicit so it will have a DIV around it, to avoid more paragraphs connected together
        listItem.blocks.forEach(setParagraphNotImplicit);

        context.modelHandlers.blockGroupChildren(doc, li, listItem, context);

        unwrap(li);
    }

    context.onNodeCreated?.(listItem, li);

    return refNode;
};
