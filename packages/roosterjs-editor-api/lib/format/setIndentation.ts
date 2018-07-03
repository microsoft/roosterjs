import execCommand from './execCommand';
import { Editor } from 'roosterjs-editor-core';
import { DocumentCommand, Indentation, ChangeSource, QueryScope } from 'roosterjs-editor-types';
import getNodeAtCursor from '../cursor/getNodeAtCursor';

/**
 * Set indentation at selection
 * If selection contains bullet/numbering list, increase/decrease indentation will
 * increase/decrease the list level by one.
 * @param editor The editor instance
 * @param indentation The indentation option:
 * Indentation.Increase to increase indentation or Indentation.Decrease to decrease indentation
 */
export default function setIndentation(editor: Editor, indentation: Indentation) {
    let command =
        indentation == Indentation.Increase ? DocumentCommand.Indent : DocumentCommand.Outdent;
    editor.addUndoSnapshot(() => {
        let listNode = getNodeAtCursor(editor, ['OL', 'UL']);
        execCommand(editor, command, true /*doWorkaroundForList*/);

        if (!listNode) {
            editor.queryElements('BLOCKQUOTE', QueryScope.OnSelection, node => {
                node.style.marginTop = '0px';
                node.style.marginBottom = '0px';
            });
        }
    }, ChangeSource.Format);
}
