// A regex to match text that only has space and CR
// We use real space char " " (\u0020) here but not "\s" since "\s" will also match "&nbsp;" (\u00A0) which is something we need to keep
const SPACE_TEXT_REGEX = /^[\r\n\t ]*$/;

/**
 * @internal
 */
export function hasSpacesOnly(txt: string): boolean {
    return SPACE_TEXT_REGEX.test(txt);
}
