import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle bold at selection
 * @param editor The editor instance
 */
export default function toggleBold(editor: Editor): void {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('bold', false, null);
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}
