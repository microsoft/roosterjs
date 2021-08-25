import { BeforePasteEvent, TrustedHTMLHandler } from 'roosterjs-editor-types';
import { moveChildNodes } from 'roosterjs-editor-dom';

/**
 * @internal
 * Convert pasted content if there are HTML and Image data in the Clipboard
 * @param event The BeforePaste event
 */
export default function convertPastedImage(
    event: BeforePasteEvent,
    trustedHTMLHandler: TrustedHTMLHandler
) {
    const { fragment, clipboardData } = event;
    const { html, image } = clipboardData;

    if (html && image) {
        //If there are Html in the clipboard, and the html body only have one img children, use the HTML
        const doc = new DOMParser().parseFromString(trustedHTMLHandler(html), 'text/html');
        moveChildNodes(fragment, doc?.body);
    }
}
