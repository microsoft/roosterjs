import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-editor-core';

export default function toggleNumbering(editor: Editor): void {
    editor.focus();
    execFormatWithUndo(editor, () => {
        editor.getDocument().execCommand('insertOrderedList', false, null);
    });
}
