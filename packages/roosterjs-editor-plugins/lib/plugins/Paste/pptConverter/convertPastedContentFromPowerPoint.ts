import { moveChildNodes } from 'roosterjs-editor-dom';
import type { BeforePasteEvent, TrustedHTMLHandler } from 'roosterjs-editor-types';

/**
 * @internal
 * Convert pasted content from PowerPoint
 * @param event The BeforePaste event
 */
export default function convertPastedContentFromPowerPoint(
    event: BeforePasteEvent,
    trustedHTMLHandler: TrustedHTMLHandler
) {
    const { fragment, clipboardData } = event;

    if (clipboardData.html && !clipboardData.text && clipboardData.image) {
        // It is possible that PowerPoint copied both image and HTML but not plain text.
        // We always prefer HTML if any.
        const doc = new DOMParser().parseFromString(
            trustedHTMLHandler(clipboardData.html),
            'text/html'
        );

        moveChildNodes(fragment, doc?.body);
    }
}
