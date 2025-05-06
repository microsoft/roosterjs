const HtmlCommentStart = '\x3C!--';
const HtmlCommentEnd = '-->';
const styleTag = '<style';
const styleClosingTag = '</style>';
const headClosingTag = '</head>';

/**
 * @internal
 * Exported only for unit test
 */
export function cleanHtmlComments(html: string) {
    let { styleIndex, headEndIndex, styleEndIndex } = extractHtmlIndexes(html);

    while (styleIndex < headEndIndex && styleIndex > -1) {
        html = removeCommentsFromHtml(html, HtmlCommentStart, styleEndIndex, styleIndex);
        html = removeCommentsFromHtml(html, HtmlCommentEnd, styleEndIndex, styleIndex);

        ({ styleIndex, headEndIndex, styleEndIndex } = extractHtmlIndexes(html, styleEndIndex + 1));
    }

    return html;
}

function extractHtmlIndexes(html: string, startIndex: number = 0) {
    const htmlLowercase = html.toLowerCase();
    const styleIndex = htmlLowercase.indexOf(styleTag, startIndex);
    const styleEndIndex = htmlLowercase.indexOf(styleClosingTag, startIndex);
    const headEndIndex = htmlLowercase.indexOf(headClosingTag);
    return { styleIndex, headEndIndex, styleEndIndex };
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
