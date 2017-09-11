import execFormatWithUndo from './execFormatWithUndo';
import { ContentScope } from 'roosterjs-types';
import { ImageInlineElement } from 'roosterjs-dom';
import { Editor } from 'roosterjs-core';

export default function setImageAltText(editor: Editor, altText: string): void {
    editor.focus();
    let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
    let startInline = contentTraverser.currentInlineElement;
    let imageNodes: Node[] = [];
    while (startInline) {
        if (startInline instanceof ImageInlineElement) {
            imageNodes.push(startInline.getContainerNode());
        }
        startInline = contentTraverser.getNextInlineElement();
    }

    // TODO: what if an image that is embeded deeply in an inline element? Not common, but likely
    if (imageNodes.length > 0) {
        execFormatWithUndo(editor, () => {
            for (let node of imageNodes) {
                (node as HTMLElement).setAttribute('alt', altText);
            }
        });
    }
}
