import execFormatWithUndo from './execFormatWithUndo';
import { Editor } from 'roosterjs-editor-core';
import { Indentation } from 'roosterjs-editor-types';

export default function setIndentation(editor: Editor, indentation: Indentation): void {
    editor.focus();
    let command = indentation == Indentation.Increase ? 'indent' : 'outdent';
    execFormatWithUndo(editor, () => {
        editor.getDocument().execCommand(command, false, null);
    });
}
