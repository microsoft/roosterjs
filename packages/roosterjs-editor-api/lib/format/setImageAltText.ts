import execFormatWithUndo from './execFormatWithUndo';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor } from 'roosterjs-editor-core';

/**
 * Set image alt text at selection
 * @param editor The editor instance
 * @param altText The image alt text
 */
export default function setImageAltText(editor: Editor, altText: string): void {
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
