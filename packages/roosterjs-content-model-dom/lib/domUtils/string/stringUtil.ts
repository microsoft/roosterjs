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
