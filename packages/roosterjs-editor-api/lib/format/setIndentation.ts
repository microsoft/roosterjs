import execFormatWithUndo from './execFormatWithUndo';
import getFormatState from '../format/getFormatState';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor } from 'roosterjs-editor-core';
import { Indentation } from 'roosterjs-editor-types';

export default function setIndentation(editor: Editor, indentation: Indentation): void {
    editor.focus();
    let command = indentation == Indentation.Increase ? 'indent' : 'outdent';
    execFormatWithUndo(editor, () => {
        let format = getFormatState(editor);
        editor.getDocument().execCommand(command, false, null);
        if (!format.isBullet && !format.isNumbering) {
            let nodes = queryNodesWithSelection(editor, 'blockquote');
            nodes.forEach(node => {
                (<HTMLElement>node).style.marginTop = '0px';
                (<HTMLElement>node).style.marginBottom = '0px';
            });
        }
    });
}
