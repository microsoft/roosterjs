import { BeforePasteEvent, TrustedHTMLHandler } from 'roosterjs-editor-types';
import { getTagOfNode, moveChildNodes } from 'roosterjs-editor-dom';

/**
 * @internal
 * Convert pasted content is a image
 * @param event The BeforePaste event
 */
export default function convertPastedImage(
    event: BeforePasteEvent,
    trustedHTMLHandler: TrustedHTMLHandler
) {
    const { fragment, clipboardData } = event;

    if (clipboardData.html && clipboardData.image) {
        //If there are Html in the clipboard, and the html body only have one img children, use the HTML
        const doc = new DOMParser().parseFromString(
            trustedHTMLHandler(clipboardData.html),
            'text/html'
        );

        if (
            doc?.body &&
            doc.body.children.length === 1 &&
            getTagOfNode(doc.body.firstChild) === 'IMG'
        ) {
            moveChildNodes(fragment, doc?.body);
        }
    }
}
