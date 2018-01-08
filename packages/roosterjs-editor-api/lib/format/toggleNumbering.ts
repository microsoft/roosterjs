import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-editor-core';
import { workaroundForEdge, removeWorkaroundForEdge } from './toggleBullet';

/**
 * Toggle numbering at selection
 * @param editor The editor instance
 */
export default function toggleNumbering(editor: Editor): void {
    editor.focus();
    execFormatWithUndo(editor, () => {
        let workaroundSpan = workaroundForEdge(editor);
        editor.getDocument().execCommand('insertOrderedList', false, null);
        removeWorkaroundForEdge(workaroundSpan);
    });
}
