// According to https://embracethered.com/blog/posts/2024/hiding-and-finding-text-with-unicode-tags/
// there are some invisible unicode characters in the range of U+E0000 to U+EFFFF, which are used for hiding text in HTML.
// We need to strip them out before processing the pasted content, otherwise they will be treated as normal text and cause unexpected behavior.
const INVISIBLE_UNICODE_REGEX = /[\u{E0000}-\u{EFFFF}]/gu;

/**
 * Strip invisible unicode characters from the given string
 * @param value The string to be processed
 * @returns The string with invisible unicode characters removed
 */
export function stripInvisibleUnicode(value: string): string {
    return value.replace(INVISIBLE_UNICODE_REGEX, '');
}
