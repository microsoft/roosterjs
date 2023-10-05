import { KnownAnnounceStrings } from 'roosterjs-editor-types';
import {
    convertDecimalsToAlpha,
    convertDecimalsToRoman,
    safeInstanceOf,
    VList,
} from 'roosterjs-editor-dom';
import type { AnnounceData } from 'roosterjs-editor-types';

/**
 * @internal
 * Get the announce data for the current List
 * @returns announce data for list or undefined.
 */
export default function getAnnounceDataForList(
    list: HTMLElement | null,
    li: HTMLElement | null
): AnnounceData | undefined {
    if (!safeInstanceOf(li, 'HTMLLIElement')) {
        return undefined;
    }

    if (li && safeInstanceOf(list, 'HTMLOListElement')) {
        const vList = new VList(list);
        const listItemIndex = vList.getListItemIndex(li);
        let stringToAnnounce = listItemIndex == -1 ? '' : listItemIndex.toString();
        switch (list.style.listStyleType) {
            case 'lower-alpha':
            case 'lower-latin':
            case 'upper-alpha':
            case 'upper-latin':
                stringToAnnounce = convertDecimalsToAlpha(listItemIndex - 1);
                break;
            case 'lower-roman':
            case 'upper-roman':
                stringToAnnounce = convertDecimalsToRoman(listItemIndex);
                break;
        }

        return {
            defaultStrings: KnownAnnounceStrings.AnnounceListItemNumbering,
            formatStrings: [stringToAnnounce],
        };
    } else if (safeInstanceOf(list, 'HTMLUListElement')) {
        return {
            defaultStrings: KnownAnnounceStrings.AnnounceListItemBullet,
        };
    }
    return undefined;
}
