import { findListItemsInSameThread } from './findListItemsInSameThread';
import {
    getAutoListStyleType,
    getClosestAncestorBlockGroupIndex,
    getOrderedListNumberStr,
    updateListMetadata,
} from 'roosterjs-content-model-dom';
import type {
    AnnounceData,
    ContentModelBlockGroup,
    ContentModelListItem,
} from 'roosterjs-content-model-types';

export function getListAnnounceData(path: ContentModelBlockGroup[]): AnnounceData | null {
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

function getListNumber(path: ContentModelBlockGroup[], listItem: ContentModelListItem) {
    const items = findListItemsInSameThread(path[path.length - 1], listItem);
    let listNumber = items[0].levels[items[0].levels.length - 1]?.format.startNumberOverride ?? 1;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item == listItem) {
            break;
        } else if (!item.levels[item.levels.length - 1].format.displayForDummyItem) {
            listNumber++;
        }
    }
    return listNumber;
}
