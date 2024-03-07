/**
 * Normalize spaces of the given string. After normalization, all leading (for forward) or trailing (for backward) spaces
 * will be replaces with non-break space (160)
 * @param txt The string to normalize
 * @param isForward Whether normalize forward or backward
 */
export function normalizeText(txt: string, isForward: boolean): string {
    return txt.replace(isForward ? /^\u0020+/ : /\u0020+$/, '\u00A0');
}
