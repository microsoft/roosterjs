import { BeforePasteEvent } from 'roosterjs-editor-types';
import { moveChildNodes } from 'roosterjs-editor-dom';

/**
 * @internal
 * Convert pasted content from PowerPoint
 * @param event The BeforePaste event
 */
export default function convertPastedContentFromPowerPoint(event: BeforePasteEvent) {
    const { fragment, clipboardData } = event;

    if (clipboardData.html && !clipboardData.text && clipboardData.image) {
        // It is possible that PowerPoint copied both image and HTML but not plain text.
        // We always prefer HTML if any.
        const doc = new DOMParser().parseFromString(clipboardData.html, 'text/html');

        moveChildNodes(fragment, doc?.body);
    }
}
