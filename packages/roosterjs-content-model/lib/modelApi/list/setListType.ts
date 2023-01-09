import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { createListItem } from '../creators/createListItem';
import { getOperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';

/**
 * @internal
 */
export function setListType(model: ContentModelDocument, listType: 'OL' | 'UL') {
    const paragraphOrListItems = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        [] // Set stop types to be empty so we can find list items even cross the boundary of table, then we can always operation on the list item if any
    );
    const alreadyInExpectedType = paragraphOrListItems.every(
        ({ block }) =>
            isBlockGroupOfType<ContentModelListItem>(block, 'ListItem') &&
            block.levels[block.levels.length - 1]?.listType == listType
    );

    paragraphOrListItems.forEach(({ block, parent }, itemIndex) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const level = block.levels.pop();

            if (!alreadyInExpectedType && level) {
                level.listType = listType;
                block.levels.push(level);
            } else if (block.blocks.length == 1) {
                setParagraphNotImplicit(block.blocks[0]);
            }
        } else if (block.blockType == 'Paragraph') {
            const index = parent.blocks.indexOf(block);

            if (index >= 0) {
                const prevBlock = parent.blocks[index - 1];
                const newListItem = createListItem(
                    [
                        {
                            listType,
                            startNumberOverride:
                                itemIndex > 0 ||
                                (prevBlock?.blockType == 'BlockGroup' &&
                                    prevBlock.blockGroupType == 'ListItem' &&
                                    prevBlock.levels[0]?.listType == 'OL')
                                    ? undefined
                                    : 1,
                        },
                    ],
                    block.segments[0]?.format
                );

                // Since there is only one paragraph under the list item, no need to keep its paragraph element (DIV).
                // TODO: Do we need to keep the CSS styles applied to original DIV?
                block.isImplicit = true;

                newListItem.blocks.push(block);

                parent.blocks.splice(index, 1, newListItem);
            }
        }
    });

    return paragraphOrListItems.length > 0;
}
