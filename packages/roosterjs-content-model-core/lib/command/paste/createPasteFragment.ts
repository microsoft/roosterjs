import { moveChildNodes, textToFragment } from 'roosterjs-content-model-dom';
import type { ClipboardData, PasteType } from 'roosterjs-content-model-types';

/**
 * @internal
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
