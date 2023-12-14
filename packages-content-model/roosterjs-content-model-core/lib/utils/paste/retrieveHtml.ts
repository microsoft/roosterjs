import type { ClipboardData } from 'roosterjs-content-model-types';

const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';

/**
 * @internal
 */
export interface HtmlFromClipboard {
    htmlBefore?: string;
    htmlAfter?: string;
    html?: string;
}

/**
 * @internal
 */
export function retrieveHtml(clipboardData: ClipboardData, html: HtmlFromClipboard) {
    const rawHtml = clipboardData.rawHtml ?? '';

    const startIndex = rawHtml.indexOf(START_FRAGMENT);
    const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);

    if (startIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
        html.htmlBefore = rawHtml.substring(0, startIndex);
        html.htmlAfter = rawHtml.substring(endIndex + END_FRAGMENT.length);
        html.html = rawHtml.substring(startIndex + START_FRAGMENT.length, endIndex);
    } else {
        html.html = rawHtml;
    }
}
