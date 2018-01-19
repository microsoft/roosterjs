import execFormatWithUndo from './execFormatWithUndo';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor } from 'roosterjs-editor-core';

/**
 * Set image alt text for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * Alt text (alternative text) is a word or phrase that can be inserted as an
 * attribute in an HTML document to tell viewers the contents of an image.
 * @param editor The editor instance
 * @param altText The image alt text
 */
export default function setImageAltText(editor: Editor, altText: string) {
    editor.focus();
    let imageNodes = queryNodesWithSelection(editor, 'img');

    if (imageNodes.length > 0) {
        execFormatWithUndo(editor, () => {
            for (let node of imageNodes) {
                (node as HTMLElement).setAttribute('alt', altText);
            }
        });
    }
}
