import { findStyleTagIndexes } from 'roosterjs-content-model-dom';

const HtmlCommentStart = '\x3C!--';
const HtmlCommentStart2 = '<!--';
const HtmlCommentEnd = '-->';

/**
 * @internal
 * Exported only for unit test
 */
export function cleanHtmlComments(html: string) {
    let { styleIndex, styleEndIndex } = findStyleTagIndexes(html);

    while (styleIndex > -1) {
        html = removeCommentsFromHtml(html, HtmlCommentStart, styleEndIndex, styleIndex);
        html = removeCommentsFromHtml(html, HtmlCommentStart2, styleEndIndex, styleIndex);
        html = removeCommentsFromHtml(html, HtmlCommentEnd, styleEndIndex, styleIndex);

        ({ styleIndex, styleEndIndex } = findStyleTagIndexes(html, styleEndIndex + 1));
    }

    return html;
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
