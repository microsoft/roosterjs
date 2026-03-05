const INVISIBLE_UNICODE_REGEX =
    // eslint-disable-next-line no-misleading-character-class
    /[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u200B-\u200F\u202A-\u202E\u2028\u2029\u2060-\u2064\u2066-\u2069\u3164\uFEFF\uFFA0]|\uDB40[\uDC01-\uDC7F]/g;

/**
 * Strip invisible Unicode characters from a string.
 * This removes zero-width characters, bidirectional marks, Unicode Tags (U+E0001-U+E007F),
 * and other invisible formatting characters that can be used to hide content in links.
 * @param value The string to strip invisible characters from
 * @returns The string with invisible characters removed
 */
export function stripInvisibleUnicode(value: string): string {
    return value.replace(INVISIBLE_UNICODE_REGEX, '');
}
