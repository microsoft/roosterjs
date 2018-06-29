import execCommand from './execCommand';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Alignment, DocumentCommand, ChangeSource } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alignment option:
 * Alignment.Center, Alignment.Left, Alignment.Right
 */
export default function setAlignment(editor: Editor, alignment: Alignment) {
    let command = DocumentCommand.JustifyLeft;
    let align = 'left';

    if (alignment == Alignment.Center) {
        command = DocumentCommand.JustifyCenter;
        align = 'center';
    } else if (alignment == Alignment.Right) {
        command = DocumentCommand.JustifyRight;
        align = 'right';
    }

    editor.addUndoSnapshot(() => {
        execCommand(editor, command);
        queryNodesWithSelection(
            editor,
            '[align]',
            false /*nodeContainedByRangeOnly*/,
            node => (node.style.textAlign = align)
        );
    }, ChangeSource.Format);
}
