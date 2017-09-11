import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-core';

export default function clearFormat(editor: Editor): void {
    editor.focus();
    // We have no way if this clear format will really result in any DOM change
    // Let's just do it with undo
    execFormatWithUndo(editor, () => {
        editor.getDocument().execCommand('removeFormat', false, null);
    });
}
