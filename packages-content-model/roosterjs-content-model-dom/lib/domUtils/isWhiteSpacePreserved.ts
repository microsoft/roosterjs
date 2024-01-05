// According to https://developer.mozilla.org/en-US/docs/Web/CSS/white-space, these style values will need to preserve white spaces
const WHITESPACE_PRE_VALUES = ['pre', 'pre-wrap', 'break-spaces'];

/**
 * Check if the given white-space style value will cause preserving white space
 * @param whiteSpace The white-space style value to check
 */
export function isWhiteSpacePreserved(whiteSpace: string | undefined): boolean {
    return !!whiteSpace && WHITESPACE_PRE_VALUES.indexOf(whiteSpace) >= 0;
}
