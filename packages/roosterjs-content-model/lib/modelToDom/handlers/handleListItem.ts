import { applyFormat } from '../utils/applyFormat';
import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelListItem } from '../../publicTypes/block/group/ContentModelListItem';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export const handleListItem: ContentModelHandler<ContentModelListItem> = (
    doc: Document,
    parent: Node,
    listItem: ContentModelListItem,
    context: ModelToDomContext
) => {
    context.modelHandlers.list(doc, parent, listItem, context);

    const { nodeStack } = context.listFormat;

    let listParent = nodeStack?.[nodeStack?.length - 1]?.node || parent;
    let tag = getTagOfNode(listParent);

    if (tag == 'OL' || tag == 'UL') {
        const li = doc.createElement('li');
        const level = listItem.levels[listItem.levels.length - 1];

        listParent.appendChild(li);
        listParent = li;

        applyFormat(li, context.formatAppliers.segment, listItem.formatHolder.format, context);

        if (level) {
            applyFormat(li, context.formatAppliers.listItem, level, context);
        }
    } else {
        // There is no level for this list item, that means it should be moved out of the list
        // For each paragraph, make it not implicit so it will have a DIV around it, to avoid more paragraphs connected together
        listItem.blocks.forEach(block => {
            if (block.blockType == 'Paragraph') {
                block.isImplicit = false;
            }
        });
    }

    context.modelHandlers.blockGroupChildren(doc, listParent, listItem, context);
};
