import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-editor-core';
import { workaroundForEdge, removeWorkaroundForEdge } from './toggleBullet';

export default function toggleNumbering(editor: Editor): void {
    editor.focus();
    execFormatWithUndo(editor, () => {
        let hasWorkaround = workaroundForEdge(editor);
        editor.getDocument().execCommand('insertOrderedList', false, null);
        if (hasWorkaround) {
            removeWorkaroundForEdge(editor);
        }
    });
}
