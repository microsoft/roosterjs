import { ContentModelDocument } from '../../publicTypes/block/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/block/group/ContentModelListItem';
import { createListItem } from '../creators/createListItem';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { getSelectedParagraphs } from '../selection/getSelectedParagraphs';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

/**
 * @internal
 */
export function setListType(model: ContentModelDocument, listType: 'OL' | 'UL') {
    const paragraphs = getSelectedParagraphs(model);
    const paragraphOrListItems = getOperationalBlocks<ContentModelListItem>(
        paragraphs,
        ['ListItem'],
        [] // Set stop types to be empty so we can find list items even cross the boundary of table, then we can always operation on the list item if any
    );
    const alreadyInExpectedType = paragraphOrListItems.every(
        item =>
            isBlockGroupOfType(item, 'ListItem') &&
            item.levels[item.levels.length - 1]?.listType == listType
    );

    paragraphOrListItems.forEach((item, itemIndex) => {
        if (isBlockGroupOfType(item, 'ListItem')) {
            const level = item.levels.pop();

            if (!alreadyInExpectedType && level) {
                level.listType = listType;
                item.levels.push(level);
            }
        } else {
            const group = item.path[0];
            const index = group.blocks.indexOf(item.paragraph);
            const prevBlock = group.blocks[index - 1];
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
                item.paragraph.segments[0]?.format
            );

            newListItem.blocks.push(item.paragraph);

            group.blocks.splice(index, 1, newListItem);
        }
    });

    return paragraphOrListItems.length > 0;
}
