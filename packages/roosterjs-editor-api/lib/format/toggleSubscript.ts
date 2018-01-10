import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle subscript at selection
 * @param editor The editor instance
 */
export default function toggleSubscript(editor: Editor) {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('subscript', false, null);
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}
