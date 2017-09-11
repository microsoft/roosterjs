import execFormatWithUndo from './execFormatWithUndo';
import { Alignment } from 'roosterjs-types';
import { Editor } from 'roosterjs-core';

export default function setAlignment(editor: Editor, alignment: Alignment): void {
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
