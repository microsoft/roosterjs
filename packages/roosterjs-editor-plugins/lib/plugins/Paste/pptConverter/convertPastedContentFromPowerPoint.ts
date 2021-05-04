import { BeforePasteEvent } from 'roosterjs-editor-types';

/**
 * @internal
 * Convert pasted content from PowerPoint
 * @param event The BeforePaste event
 */
export default function convertPastedContentFromExcel(event: BeforePasteEvent) {
    const { fragment, clipboardData } = event;

    if (clipboardData.html && !clipboardData.text && clipboardData.image) {
        // It is possible that PowerPoint copied both image and HTML but not plain text.
        // We always prefer HTML if any.
        const doc = new DOMParser().parseFromString(clipboardData.html, 'text/html');

        while (fragment.firstChild) {
            fragment.removeChild(fragment.firstChild);
        }
        while (doc?.body?.firstChild) {
            fragment.appendChild(doc.body.firstChild);
        }
    }
}
