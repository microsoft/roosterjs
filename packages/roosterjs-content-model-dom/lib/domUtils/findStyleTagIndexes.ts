const StyleTag = '<style';
const StyleClosingTag = '</style>';
const nonWordCharacterRegex = /\W/;

/**
 * Find the indexes of the next `<style>...</style>` block in an HTML string.
 * The opening match is rejected if the character after `<style` is a word
 * character (e.g. `<styles>` would otherwise falsely match).
 * @param html The HTML string to scan
 * @param startIndex Index to start searching from (default 0)
 * @returns Object with `styleIndex` (start of `<style`) and `styleEndIndex` (start of `</style>`).
 *          Either may be `-1` if not found.
 */
export function findStyleTagIndexes(
    html: string,
    startIndex: number = 0
): { styleIndex: number; styleEndIndex: number } {
    const htmlLowercase = html.toLowerCase();
    let styleIndex = htmlLowercase.indexOf(StyleTag, startIndex);
    let currentIndex = styleIndex + StyleTag.length;
    let nextChar = html.substring(currentIndex, currentIndex + 1);

    while (!nonWordCharacterRegex.test(nextChar) && styleIndex > -1) {
        styleIndex = htmlLowercase.indexOf(StyleTag, styleIndex + 1);
        currentIndex = styleIndex + StyleTag.length;
        nextChar = html.substring(currentIndex, currentIndex + 1);
    }

    const styleEndIndex = htmlLowercase.indexOf(StyleClosingTag, startIndex);
    return { styleIndex, styleEndIndex };
}
