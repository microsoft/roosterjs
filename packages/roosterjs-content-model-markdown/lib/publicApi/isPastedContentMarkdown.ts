import type { ClipboardData, DOMCreator } from 'roosterjs-content-model-types';

// Tags that are considered "thin wrappers", which only add structure (such as line breaks)
// around the plain text without applying any real formatting to its content.
const ThinWrapperTags = new Set<string>(['DIV', 'P', 'BR', 'SPAN']);

/**
 * Detect whether the given clipboard content can be interpreted as markdown.
 * @param doc The document to use for creating the document fragment.
 * @param clipboardData The clipboard data to check.
 * @param trustedHTMLHandler The handler to use for parsing HTML.
 * @returns True if the content can be interpreted as markdown, false otherwise.
 */
export function isPastedContentMarkdown(
    doc: Document,
    clipboardData: ClipboardData,
    trustedHTMLHandler: DOMCreator
): boolean {
    const { text, rawHtml } = clipboardData;

    // There must be some plain text to interpret as markdown
    if (!text || !text.trim()) {
        return false;
    }

    // No HTML content at all (text/plain only), so the plain text is all we have
    if (!rawHtml) {
        return true;
    }

    const fragment = parseHtmlToFragment(rawHtml, doc, trustedHTMLHandler);

    return isThinWrapperOfPlainText(fragment, text);
}

function isThinWrapperOfPlainText(fragment: DocumentFragment, text: string): boolean {
    const elements = fragment.querySelectorAll('*');

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        if (!ThinWrapperTags.has(element.tagName)) {
            return false;
        }

        for (let j = 0; j < element.attributes.length; j++) {
            const attr = element.attributes[j];

            if (attr.name === 'class' || attr.name !== 'style') {
                return false;
            }
        }
    }

    // Make sure the HTML and the plain text actually represent the same content
    return removeWhitespace(fragment.textContent || '') === removeWhitespace(text);
}

function removeWhitespace(text: string): string {
    return text.replace(/\s/g, '');
}

function parseHtmlToFragment(
    html: string,
    doc: Document,
    trustedHTMLHandler: DOMCreator
): DocumentFragment {
    const parsedDoc = trustedHTMLHandler.htmlToDOM(html);
    const fragment = doc.createDocumentFragment();
    const body = parsedDoc?.body;

    if (body) {
        while (body.firstChild) {
            fragment.appendChild(body.firstChild);
        }
    }

    return fragment;
}
