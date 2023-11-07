const SPACES_REGEX = /[\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;
const PUNCTUATIONS = '.,?!:"()[]\\/';

/**
 * @internal
 * Check if the given character is punctuation
 * @param char The character to check
 */
export function isPunctuation(char: string) {
    return PUNCTUATIONS.indexOf(char) >= 0;
}

/**
 * @internal
 * Check if the give character is a space. A space can be normal ASCII pace (32) or non-break space (160) or other kinds of spaces
 * such as ZeroWidthSpace, ...
 * @param char The character to check
 */
export function isSpace(char: string) {
    const code = char?.charCodeAt(0) ?? 0;
    return code == 160 || code == 32 || SPACES_REGEX.test(char);
}

/**
 * @internal
 * Normalize spaces of the given string. After normalization, all leading (for forward) or trailing (for backward) spaces
 * will be replaces with non-break space (160)
 * @param txt The string to normalize
 * @param isForward Whether normalize forward or backward
 */
export function normalizeText(txt: string, isForward: boolean): string {
    return txt.replace(isForward ? /^\u0020+/ : /\u0020+$/, '\u00A0');
}
