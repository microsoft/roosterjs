const HtmlCommentStart = '\x3C!--';
const HtmlCommentStart2 = '<!--';
const HtmlCommentEnd = '-->';
const styleTag = '<style';
const styleClosingTag = '</style>';
const nonWordCharacterRegex = /\W/;

/**
 * @internal
 * Exported only for unit test
 */
export function cleanHtmlComments(html: string) {
    let { styleIndex, styleEndIndex } = extractHtmlIndexes(html);

    while (styleIndex > -1) {
        html = removeCommentsFromHtml(html, HtmlCommentStart, styleEndIndex, styleIndex);
        html = removeCommentsFromHtml(html, HtmlCommentStart2, styleEndIndex, styleIndex);
        html = removeCommentsFromHtml(html, HtmlCommentEnd, styleEndIndex, styleIndex);

        ({ styleIndex, styleEndIndex } = extractHtmlIndexes(html, styleEndIndex + 1));
    }

    return html;
}

function extractHtmlIndexes(html: string, startIndex: number = 0) {
    const htmlLowercase = html.toLowerCase();
    let styleIndex = htmlLowercase.indexOf(styleTag, startIndex);
    let currentIndex = styleIndex + styleTag.length;
    let nextChar = html.substring(currentIndex, currentIndex + 1);

    while (!nonWordCharacterRegex.test(nextChar) && styleIndex > -1) {
        styleIndex = htmlLowercase.indexOf(styleTag, styleIndex + 1);
        currentIndex = styleIndex + styleTag.length;
        nextChar = html.substring(currentIndex, currentIndex + 1);
    }

    const styleEndIndex = htmlLowercase.indexOf(styleClosingTag, startIndex);
    return { styleIndex, styleEndIndex };
}

function removeCommentsFromHtml(
    html: string,
    marker: string,
    endId: number,
    startId: number
): string {
    let id = html.indexOf(marker, startId);
    while (id > -1 && id < endId) {
        html = html.substring(0, id) + html.substring(id + marker.length);
        id = html.indexOf(marker, id + 1);
    }
    return html;
}
