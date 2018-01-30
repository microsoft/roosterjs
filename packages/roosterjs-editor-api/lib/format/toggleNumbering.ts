import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-editor-core';
import { workaroundForEdge } from './toggleBullet';

/**
 * Toggle numbering at selection
 * If selection contains numbering in deep level, toggle numbering will decrease the numbering level by one
 * If selection contains bullet list, toggle numbering will convert the bullet list into number list
 * If selection contains both bullet/numbering and normal text, the behavior is decided by corresponding
 * realization of browser execCommand API
 * @param editor The editor instance
 */
export default function toggleNumbering(editor: Editor) {
    editor.focus();
    execFormatWithUndo(editor, () => {
        workaroundForEdge(editor, () => {
            editor.getDocument().execCommand('insertOrderedList', false, null);
        });
    });
}
