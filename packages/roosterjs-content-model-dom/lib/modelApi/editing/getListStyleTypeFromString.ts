import { getObjectKeys } from '../../domUtils/getObjectKeys';
import { OrderedListStyleMap } from '../../constants/OrderedListStyleMap';
import { UnorderedListStyleMap } from '../../constants/UnorderedListStyleMap';

/**
 * Gets the list style type that the bullet is part of, using the Constant record
 * @param listType whether the list is ordered or unordered
 * @param bullet bullet string
 * @returns the number of the style override or undefined if was not found in the Record
 */
export function getListStyleTypeFromString(listType: 'OL' | 'UL', bullet: string) {
    const map = listType == 'OL' ? OrderedListStyleMap : UnorderedListStyleMap;
    const keys = getObjectKeys(map);
    const result = keys.find(key => map[key] == bullet);
    if (result) {
        return typeof result == 'string' ? parseInt(result) : result;
    }
    return result;
}
