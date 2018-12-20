import { ChangeSource, DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Execute a document command
 * @param editor The editor instance
 * @param command The command to execute
 * @param addUndoSnapshotWhenCollapsed Optional, set to true to always add undo snapshot even current selection is collapsed.
 * Default value is false.
 * @param doWorkaroundForList Optional, set to true to do workaround for list in order to keep current format.
 * Default value is false.
 */
export default function execCommand(editor: Editor, command: DocumentCommand) {
    editor.focus();
    let formatter = () => editor.getDocument().execCommand(command, false, null);

    let range = editor.getSelectionRange();
    if (range && range.collapsed) {
        editor.addUndoSnapshot();
        formatter();
    } else {
        editor.addUndoSnapshot(formatter, ChangeSource.Format);
    }
}
