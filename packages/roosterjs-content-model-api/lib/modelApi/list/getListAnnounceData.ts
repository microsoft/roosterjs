import { findListItemsInSameThread } from './findListItemsInSameThread';
import {
    getAutoListStyleType,
    getClosestAncestorBlockGroupIndex,
    getOrderedListNumberStr,
    updateListMetadata,
} from 'roosterjs-content-model-dom';
import type {
    AnnounceData,
    ContentModelListItem,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelListItem,
} from 'roosterjs-content-model-types';

/**
 * Get announce data for list item
 * @param path Content model path that include the list item
 * @returns Announce data of current list item if any, or null
 */
export function getListAnnounceData(path: ReadonlyContentModelBlockGroup[]): AnnounceData | null {
    const index = getClosestAncestorBlockGroupIndex(path, ['ListItem'], ['TableCell']);

    if (index >= 0) {
        const listItem = path[index] as ContentModelListItem;
        const level = listItem.levels[listItem.levels.length - 1];

        if (level.format.displayForDummyItem) {
            return null;
        } else if (level.listType == 'OL') {
            const listNumber = getListNumber(path, listItem);
            const metadata = updateListMetadata(level);
            const listStyle = getAutoListStyleType(
                'OL',
                metadata ?? {},
                listItem.levels.length - 1,
                level.format.listStyleType
            );

            return listStyle === undefined
                ? null
                : {
                      defaultStrings: 'announceListItemNumbering',
                      formatStrings: [getOrderedListNumberStr(listStyle, listNumber)],
                  };
        } else {
            return {
                defaultStrings: 'announceListItemBullet',
            };
        }
    } else {
        return null;
    }
}

function getListNumber(
    path: ReadonlyContentModelBlockGroup[],
    listItem: ReadonlyContentModelListItem
) {
    const items = findListItemsInSameThread(path[path.length - 1], listItem);
    let listNumber = 0;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (listNumber == 0 && item.levels.length == listItem.levels.length) {
            listNumber = item.levels[item.levels.length - 1]?.format.startNumberOverride ?? 1;
        }

        if (item == listItem) {
            // Found current item, so break and return
            break;
        } else if (item.levels.length < listItem.levels.length) {
            // Found upper level item, reset list number
            listNumber = 0;
        } else if (item.levels.length > listItem.levels.length) {
            // Found deeper level item, skip
            continue;
        } else if (!item.levels[item.levels.length - 1].format.displayForDummyItem) {
            // Save level, and is not dummy, number plus one
            listNumber++;
        }
    }
    return listNumber;
}
