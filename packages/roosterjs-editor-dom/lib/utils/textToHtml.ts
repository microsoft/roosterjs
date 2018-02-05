/**
 * Convert plain to HTML
 * @param text The plain text to convert
 * @returns HTML string to present the input text
 */
export default function textToHtml(text: string): string {
    text = (text || '').replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/(\n|\r\n)/g, '<br></div><div>');
    text = text.replace(/\s/g, '&nbsp;');
    text = `<div>${text}<br></div>`;
    return text;
}
