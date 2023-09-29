import convertDecimalsToAlpha from '../list/convertDecimalsToAlpha';
import convertDecimalsToRoman from '../list/convertDecimalsToRomans';
import safeInstanceOf from '../utils/safeInstanceOf';
import VList from '../list/VList';
import { KnownAnnounceStrings } from 'roosterjs-editor-types/lib';

/**
 * Get the announce data for the current List
 * @returns announce data for list or undefined.
 */
export default function getAnnounceDataForList(list: HTMLElement | null, li: HTMLElement | null) {
    if (!safeInstanceOf(li, 'HTMLLIElement')) {
        return;
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
            defaultStrings: KnownAnnounceStrings.AnnounceListItemNumberingIndentation,
            formatStrings: [stringToAnnounce],
        };
    } else if (safeInstanceOf(list, 'HTMLUListElement')) {
        return {
            defaultStrings: KnownAnnounceStrings.AnnounceListItemBulletIndentation,
        };
    }
    return undefined;
}
