// A regex to match text that only has space and CR
// We use real space char " " (\u0020) here but not "\s" since "\s" will also match "&nbsp;" (\u00A0) which is something we need to keep
const SPACE_TEXT_REGEX = /^[\r\n\t ]*$/;

const SPACES_REGEX = /[\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;
const PUNCTUATIONS = '.,?!:"()[]\\/';

/**
 * @internal
 */
export function isPunctuation(char: string) {
    return PUNCTUATIONS.indexOf(char) >= 0;
}

/**
 * @internal
 */
export function isSpace(char: string) {
    const code = char?.charCodeAt(0) ?? 0;
    return code == 160 || code == 32 || SPACES_REGEX.test(char);
}

/**
 * @internal
 */
export function hasSpacesOnly(txt: string): boolean {
    return SPACE_TEXT_REGEX.test(txt);
}

/**
 * @internal
 */
export function normalizeText(txt: string, isForward: boolean): string {
    return txt.replace(isForward ? /^\u0020+/ : /\u0020+$/, '\u00A0');
}
