// A regex to match text that only has space and CR
// We use real space char " " (\u0020) here but not "\s" since "\s" will also match "&nbsp;" (\u00A0) which is something we need to keep
const SPACE_TEXT_REGEX = /^[\r\n\t ]*$/;

const SPACES_REGEX = /[\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;
const PUNCTUATIONS = '.,?!:"()[]\\/';

/**
 * Check if the given character is punctuation
 * @param char The character to check
 */
export function isPunctuation(char: string) {
    return PUNCTUATIONS.indexOf(char) >= 0;
}

/**
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
 * Check if the given string only has space, including line breaks.
 * @param txt The string to check
 */
export function hasSpacesOnly(txt: string): boolean {
    return SPACE_TEXT_REGEX.test(txt);
}

/**
 * Normalize spaces of the given string. After normalization, all leading (for forward) or trailing (for backward) spaces
 * will be replaces with non-break space (160)
 * @param txt The string to normalize
 * @param isForward Whether normalize forward or backward
 */
export function normalizeText(txt: string, isForward: boolean): string {
    return txt.replace(isForward ? /^\u0020+/ : /\u0020+$/, '\u00A0');
}
