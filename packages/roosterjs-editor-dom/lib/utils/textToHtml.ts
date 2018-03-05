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
        .replace(/"/g, '&quot;');
    let lines = text.split('\n');
    if (lines.length == 2) {
        text = `<span>${lines[0]}<br></span><span>${lines[1]}</span>`;
    } else if (lines.length > 2) {
        text = '';
        lines.forEach((line, i) => {
            line = line || '\u200B'; // Use ZeroWidthSpace for empty line
            if (i == 0) {
                text += `<span>${line}<br></span>`;
            } else if (i == lines.length - 1) {
                text += `<span>${line}</span>`;
            } else {
                text += `<div>${line}</div>`;
            }
        });
    }
    text = text.replace(/\s/g, '&nbsp;');
    return text;
}
