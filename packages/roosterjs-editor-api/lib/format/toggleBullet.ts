import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-editor-core';

export default function toggleBullet(editor: Editor): void {
    editor.focus();
    execFormatWithUndo(editor, () => {
        editor.getDocument().execCommand('insertUnorderedList', false, null);
    });
}
