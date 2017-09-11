import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-core';

export default function toggleItalic(editor: Editor): void {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('italic', false, null);
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}
