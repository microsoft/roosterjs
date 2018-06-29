import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor } from 'roosterjs-editor-core';
import { ChangeSource } from 'roosterjs-editor-types';

/**
 * Set image alt text for all selected images at selection. If no images is contained
 * in selection, do nothing.
 * The alt attribute provides alternative information for an image if a user for some reason
 * cannot view it (because of slow connection, an error in the src attribute, or if the user
 * uses a screen reader). See https://www.w3schools.com/tags/att_img_alt.asp
 * @param editor The editor instance
 * @param altText The image alt text
 */
export default function setImageAltText(editor: Editor, altText: string) {
    editor.focus();
    editor.addUndoSnapshot(() => {
        queryNodesWithSelection(editor, 'IMG', false /*nodeContainedByRangeOnly*/, node =>
            node.setAttribute('alt', altText)
        );
    }, ChangeSource.Format);
}
