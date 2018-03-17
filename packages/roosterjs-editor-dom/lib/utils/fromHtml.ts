import sanitizeHtml from './sanitizeHtml';

/**
 * Creates an HTML node array from html
 * @param html the html string to create HTML elements from
 * @param ownerDocument Owner document of the result HTML elements
 * @param sanitize Whether do sanitization before create elements to avoid XSS. Default value is false
 * @returns An HTML node array to represent the given html string
 */
export default function fromHtml(
    html: string,
    ownerDocument: HTMLDocument,
    sanitize?: boolean
): Node[] {
    let element = ownerDocument.createElement('DIV');
    element.innerHTML = sanitize ? sanitizeHtml(html) : html;

    return [].slice.call(element.childNodes);
}
