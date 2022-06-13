import toArray from '../jsUtils/toArray';

/**
 * @deprecated
 * Creates an HTML node array from html
 * @param html the html string to create HTML elements from
 * @param ownerDocument Owner document of the result HTML elements
 * @returns An HTML node array to represent the given html string
 */
export default function fromHtml(html: string, ownerDocument: HTMLDocument): Node[] {
    let element = ownerDocument.createElement('DIV');
    element.innerHTML = html;

    return toArray(element.childNodes);
}
