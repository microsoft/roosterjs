import { applyFormat } from '../utils/applyFormat';
import { ContentModelListItem } from '../../publicTypes/block/group/ContentModelListItem';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { handleBlockGroupChildren } from './handleBlockGroupChildren';
import { handleList } from './handleList';
import { ListItemFormatHandlers } from '../../formatHandlers/ListItemFormatHandlers';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { SegmentFormatHandlers } from '../../formatHandlers/SegmentFormatHandlers';

/**
 * @internal
 */
export function handleListItem(
    doc: Document,
    parent: Node,
    listItem: ContentModelListItem,
    context: ModelToDomContext
) {
    handleList(doc, parent, listItem, context);

    const { nodeStack } = context.listFormat;

    let listParent = nodeStack?.[nodeStack?.length - 1]?.node || parent;
    let tag = getTagOfNode(listParent);

    if (tag == 'OL' || tag == 'UL') {
        const li = doc.createElement('li');
        const level = listItem.levels[listItem.levels.length - 1];

        listParent.appendChild(li);
        listParent = li;

        applyFormat(li, SegmentFormatHandlers, listItem.formatHolder.format, context);

        if (level) {
            applyFormat(li, ListItemFormatHandlers, level, context);
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

    handleBlockGroupChildren(doc, listParent, listItem, context);
}
