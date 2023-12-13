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
export function retrieveHtml(clipboardData: ClipboardData, outboundHtml: HtmlFromClipboard) {
    const rawHtml = clipboardData.rawHtml ?? '';

    const startIndex = rawHtml.indexOf(START_FRAGMENT);
    const endIndex = rawHtml.lastIndexOf(END_FRAGMENT);

    if (startIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
        outboundHtml.htmlBefore = rawHtml.substring(0, startIndex);
        outboundHtml.htmlAfter = rawHtml.substring(endIndex + END_FRAGMENT.length);
        outboundHtml.html = rawHtml.substring(startIndex + START_FRAGMENT.length, endIndex);
    }
}
