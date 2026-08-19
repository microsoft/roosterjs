import type { ClipboardData, PasteType } from 'roosterjs-content-model-types';
import { moveChildNodes } from '../moveChildNodes';
import { textToFragment } from '../textToFragment';

/**
 * Create a document fragment from clipboard content using the specified paste type
 * @param document The document used to create the fragment
 * @param clipboardData The clipboard data to convert
 * @param pasteType The paste type that determines which clipboard content to use
 * @param root The optional root element containing the parsed HTML content
 * @returns A document fragment containing the content to paste
 */
export function createPasteFragment(
    document: Document,
    clipboardData: ClipboardData,
    pasteType: PasteType,
    root: HTMLElement | undefined
): DocumentFragment {
    if (!clipboardData.text && pasteType === 'asPlainText' && root) {
        clipboardData.text = root.textContent || clipboardData.text;
    }

    const { imageDataUri, text } = clipboardData;
    const fragment = document.createDocumentFragment();

    if (
        (pasteType == 'asImage' && imageDataUri) ||
        (pasteType != 'asPlainText' && !text && imageDataUri)
    ) {
        // Paste image
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.src = imageDataUri;
        fragment.appendChild(img);
    } else if (pasteType != 'asPlainText' && root) {
        moveChildNodes(fragment, root);
    } else if (text) {
        return textToFragment(text, document);
    }

    return fragment;
}
