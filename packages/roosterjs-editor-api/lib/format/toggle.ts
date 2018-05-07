import { Editor } from 'roosterjs-editor-core';

/**
 * Toggle state using execCommand function
 * @param editor The editor instance
 * @param command The command to execute
 */
export default function toggle(editor: Editor, command: string) {
    editor.focus();
    editor.runWithUndo(() => {
        editor.getDocument().execCommand(command, false, null);
    });
}
