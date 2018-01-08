import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle underline at selection
 * @param editor The editor instance
 */
export default function toggleUnderline(editor: Editor): void {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('underline', false, null);
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}
