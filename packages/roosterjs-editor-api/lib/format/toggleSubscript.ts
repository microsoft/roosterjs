import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle subscript at selection
 * If selection is collapsed, it will only affect the input after caret
 * If selection contains only subscript text, the subscript style will be removed
 * If selection contains only normal text, subscript style will be added to the whole selected text
 * If selection contains both subscript and normal text, the subscript style will be removed from whole selected text
 * If selection contains any superscript text, the superscript style will be removed and then subscript style will be applied
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
