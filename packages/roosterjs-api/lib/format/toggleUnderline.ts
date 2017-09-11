import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-core';

export default function toggleUnderline(editor: Editor): void {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('underline', false, null);
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}
