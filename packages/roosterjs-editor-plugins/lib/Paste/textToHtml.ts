import { Browser } from 'roosterjs-editor-dom';

var ZERO_WIDTH_SPACE = '&#8203;';

/**
 * Convert plain to HTML
 * @param text The plain text to convert
 * @returns HTML string to present the input text
 */
export default function textToHtml(text: string): string {
    text = (text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;')
        .replace(/^ /gm, '&nbsp;')
        .replace(/\r/g, '');
    let lines = text.split('\n');
    if (lines.length == 2) {
        text = `<span>${lines[0]}<br></span><span>${lines[1]}</span>`;
    } else if (lines.length > 2) {
        text = '';
        let lineEnd = Browser.isIEOrEdge ? ZERO_WIDTH_SPACE : '<br>';
        lines.forEach((line, i) => {
            if (i == 0) {
                text += `<span>${line}<br></span>`;
            } else if (i == lines.length - 1) {
                text += `<span>${line}</span>`;
            } else {
                text += `<div>${line}${lineEnd}</div>`;
            }
        });
    }
    text = text.replace(/\s\s/g, ' &nbsp;');
    return text;
}
