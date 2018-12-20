import processList from '../utils/processList';
import { ChangeSource, DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

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
    editor.addUndoSnapshot(
        () => processList(editor, DocumentCommand.InsertOrderedList),
        ChangeSource.Format
    );
}
