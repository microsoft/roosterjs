import { isContentMarkdown } from './isContentMarkdown';
import type { ClipboardData, DOMCreator, IEditor } from 'roosterjs-content-model-types';

// Tags that are considered "thin wrappers", which only add structure (such as line breaks)
// around the plain text without applying any real formatting to its content.
const ThinWrapperTags = new Set<string>(['DIV', 'P', 'BR', 'SPAN']);

const AllowedAttributes = new Set<string>(['class', 'style']);

/**
 * Detect whether the given clipboard content can be interpreted as markdown.
 * @param editor The editor instance.
 * @param clipboardData The clipboard data to check.
 * @returns True if the content can be interpreted as markdown, false otherwise.
 */
export function isPastedContentMarkdown(editor: IEditor, clipboardData: ClipboardData): boolean {
    const { text, rawHtml } = clipboardData;

    if (!text || !text.trim()) {
        return false;
    }

    if (isContentMarkdown(text)) {
        if (!rawHtml) {
            return true;
        }

        const doc = editor.getDocument();
        const trustedHTMLHandler = editor.getDOMCreator();
        const fragment = parseHtmlToFragment(rawHtml, doc, trustedHTMLHandler);

        return isThinWrapperOfPlainText(fragment, text);
    }
    return false;
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

            if (!AllowedAttributes.has(attr.name) && !attr.name.startsWith('data-')) {
                return false;
            }
        }
    }

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
