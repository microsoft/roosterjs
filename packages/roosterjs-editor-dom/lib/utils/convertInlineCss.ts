import sanitizeHtml from './sanitizeHtml';

/**
 * @deprecated Use sanitizeHtml() instead
 */
export default function convertInlineCss(
    sourceHtml: string,
    additionalStyleNodes?: HTMLStyleElement[]
) {
    return sanitizeHtml(sourceHtml, additionalStyleNodes, true /*convertInlineCssOnly*/);
}
