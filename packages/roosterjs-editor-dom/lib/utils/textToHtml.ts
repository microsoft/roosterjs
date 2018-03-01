/**
 * Convert plain to HTML
 * @param text The plain text to convert
 * @returns HTML string to present the input text
 */
export default function textToHtml(text: string): string {
    text = text || '';
    text = text.replace(/&/g, '&amp;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/'/g, '&#39;');
    text = text.replace(/"/g, '&quot;');
    text = text.replace(/(\n|\r\n)/g, '<br>');
    text = text.replace(/\s/g, '&nbsp;');
    return text;
}
