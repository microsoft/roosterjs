import { Alignment } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alignment option:
 * Alignment.Center, Alignment.Left, Alignment.Right
 */
export default function setAlignment(editor: Editor, alignment: Alignment) {
    editor.focus();
    editor.runWithUndo(() => {
        editor
            .getDocument()
            .execCommand(
                alignment == Alignment.Center
                    ? 'justifyCenter'
                    : alignment == Alignment.Right ? 'justifyRight' : 'justifyLeft',
                false,
                null
            );
    });
}
