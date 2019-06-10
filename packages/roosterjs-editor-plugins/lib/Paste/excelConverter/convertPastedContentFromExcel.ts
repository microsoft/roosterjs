import { HtmlSanitizer } from 'roosterjs-html-sanitizer';

/**
 * Convert pasted content from Excel, add borders when source doc doesn't have a border
 * @param doc HTML Document which contains the content from Excel
 */
export default function convertPastedContentFromExcel(doc: HTMLDocument) {
    let sanitizer = new HtmlSanitizer({
        styleCallbacks: {
            border: (value, element) => value != 'none' || element.style.border != 'none',
        },
        additionalAllowAttributes: ['class'],
    });
    sanitizer.sanitize(doc.body);

    let styleNode = doc.createElement('style');
    doc.body.appendChild(styleNode);
    styleNode.innerHTML = 'td {border: solid 1px #d4d4d4}';
    sanitizer.convertGlobalCssToInlineCss(doc);
}
