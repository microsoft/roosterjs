import { HtmlSanitizer } from 'roosterjs-html-sanitizer';

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
