import type { DOMCreator } from 'roosterjs-content-model-types';

/**
 * Create a DOM document from an HTML string
 * @param html The HTML string to convert
 * @param domCreator The DOM creator used to convert the HTML string
 * @returns The converted document, or null when the HTML string is empty
 */
export function createDOMFromHtml(
    html: string | null | undefined,
    domCreator: DOMCreator
): Document | null {
    return html ? domCreator.htmlToDOM(html) : null;
}
