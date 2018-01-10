import execFormatWithUndo from './execFormatWithUndo';
import { Alignment } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alighment option
 */
export default function setAlignment(editor: Editor, alignment: Alignment) {
    editor.focus();
    let command = 'justifyLeft';
    if (alignment == Alignment.Center) {
        command = 'justifyCenter';
    } else if (alignment == Alignment.Right) {
        command = 'justifyRight';
    }
    execFormatWithUndo(editor, () => {
        editor.getDocument().execCommand(command, false, null);
    });
}
