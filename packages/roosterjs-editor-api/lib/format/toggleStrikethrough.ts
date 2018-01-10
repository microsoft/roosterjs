import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle strikethrough at selection
 * @param editor The editor instance
 */
export default function toggleStrikethrough(editor: Editor) {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('strikeThrough', false, null);
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}
