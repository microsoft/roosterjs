import { contentModelToDom, createModelToDomContext } from 'roosterjs-content-model-dom';
import { convertMarkdownToContentModel } from 'roosterjs-content-model-markdown';
import type { ClipboardData, IEditor } from 'roosterjs-content-model-types';

// Tags that are considered "thin wrappers", which only add structure (such as line breaks)
// around the plain text without applying any real formatting to its content.
const ThinWrapperTags = new Set<string>(['DIV', 'P', 'BR', 'SPAN']);

/**
 * @internal
 * Detect whether the pasted content is plain text, or HTML that is only a thin wrapper of
 * plain text (for example, each line wrapped in a DIV or P with no other formatting). When
 * this is the case we can safely interpret the plain text as markdown.
 * @param clipboardData The clipboard data of the paste
 * @param fragment The parsed HTML fragment to be pasted
 */
export function shouldConvertPastedTextToMarkdown(
    clipboardData: ClipboardData,
    fragment: DocumentFragment
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

    // There is HTML content, only continue when it is a thin wrapper of the plain text
    return isThinWrapperOfPlainText(fragment, text);
}

/**
 * @internal
 * Interpret the given plain text as markdown, convert it to a DOM tree and replace the
 * content of the given fragment with the result, so that we paste formatted HTML instead
 * of the original markdown text.
 * @param editor The editor instance
 * @param fragment The fragment whose content will be replaced
 * @param text The plain text (markdown) to convert
 */
export function convertPastedTextToMarkdown(
    editor: IEditor,
    fragment: DocumentFragment,
    text: string
) {
    const model = convertMarkdownToContentModel(text);

    while (fragment.firstChild) {
        fragment.removeChild(fragment.firstChild);
    }

    contentModelToDom(editor.getDocument(), fragment, model, createModelToDomContext());
}

function isThinWrapperOfPlainText(fragment: DocumentFragment, text: string): boolean {
    const elements = fragment.querySelectorAll('*');

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Any element that is not a structural wrapper, or that carries its own attributes
        // (style, class, etc.), means the HTML adds real formatting on top of the text.
        if (!ThinWrapperTags.has(element.tagName) || element.attributes.length > 0) {
            return false;
        }
    }

    // Make sure the HTML and the plain text actually represent the same content
    return removeWhitespace(fragment.textContent || '') === removeWhitespace(text);
}

function removeWhitespace(text: string): string {
    return text.replace(/\s/g, '');
}
