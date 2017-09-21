import execFormatWithUndo from './execFormatWithUndo';
import isSelectionCollapsed from '../cursor/isSelectionCollapsed';
import { Editor } from 'roosterjs-editor-core';

export default function toggleBlockQuote(editor: Editor): void {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand('formatBlock', false, 'blockquote');
    if (isSelectionCollapsed(editor)) {
        formatter();
    } else {
        execFormatWithUndo(editor, formatter);
    }
}