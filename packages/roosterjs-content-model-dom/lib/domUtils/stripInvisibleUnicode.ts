const INVISIBLE_UNICODE_REGEX =
    // eslint-disable-next-line no-misleading-character-class
    /[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2028\u2029\u2060-\u2064\u2066-\u2069\u3164\uFEFF\uFFA0\uFFF9-\uFFFB]|\uDB40[\uDC01-\uDCFF]/g;

/**
 * Strip invisible Unicode characters from a string.
 * This removes zero-width characters, bidirectional marks, Unicode Tags (U+E0001-U+E00FF),
 * interlinear annotation anchors, Mongolian free variation selectors,
 * and other invisible formatting characters that can be used to hide content in links.
 * Percent-encoded invisible characters (e.g. %E2%80%8B for U+200B) are also handled
 * by decoding the string first.
 *
 * @remarks This function strips ZWJ (U+200D) which may affect emoji sequences.
 * It should only be applied to href attributes, not to visible text content.
 * @param value The string to strip invisible characters from
 * @returns The string with invisible characters removed
 */
export function stripInvisibleUnicode(value: string): string {
    let decoded: string;

    try {
        decoded = decodeURIComponent(value);
    } catch {
        // If decoding fails (malformed percent-encoding), use the original value
        decoded = value;
    }

    return decoded.replace(INVISIBLE_UNICODE_REGEX, '');
}
