import { LocalizedStrings } from '../type/LocalizedStrings';

/**
 * Get a localized string
 * @param strings The LocalizedStrings map
 * @param key Key of the string
 * @param defaultString Default unlocalized string, will be used if strings is not specified or the give key doesn't exist in strings
 * @returns A localized string from the string map, or defaultString
 */
export default function getLocalizedString<T extends string, R extends string | null | undefined>(
    strings: LocalizedStrings<T> | undefined,
    key: T,
    defaultString: R
) {
    const str = strings?.[key];

    if (typeof str == 'function') {
        return str();
    } else if (typeof str == 'string') {
        return str;
    } else {
        return defaultString;
    }
}
