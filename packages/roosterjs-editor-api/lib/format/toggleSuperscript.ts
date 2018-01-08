import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle superscript at selection
 * @param editor The editor instance
 */
export default function toggleSuperscript(editor: Editor): void {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('superscript', false, null);
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}
