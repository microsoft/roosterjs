import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle italic at selection
 * @param editor The editor instance
 */
export default function toggleItalic(editor: Editor): void {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('italic', false, null);
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}
