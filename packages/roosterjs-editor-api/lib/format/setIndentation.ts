import execCommand from './execCommand';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { Editor } from 'roosterjs-editor-core';
import { DocumentCommand, Indentation } from 'roosterjs-editor-types';

/**
 * Set indentation at selection
 * If selection contains bullet/numbering list, increase/decrease indentation will
 * increase/decrease the list level by one.
 * @param editor The editor instance
 * @param indentation The indentation option:
 * Indentation.Increase to increase indentation or Indentation.Decrease to decrease indentation
 */
export default function setIndentation(editor: Editor, indentation: Indentation) {
    let command = indentation == Indentation.Increase ? DocumentCommand.Indent : DocumentCommand.Outdent;
    editor.addUndoSnapshot(() => {
        let isInlist = queryNodesWithSelection(editor, 'OL,UL').length > 0;
        execCommand(editor, command, true /*addUndoSnapshotWhenCollapsed*/, true /*doWorkaroundForList*/);

        if (!isInlist) {
            queryNodesWithSelection(editor, 'BLOCKQUOTE', false /*nodeContainedByRangeOnly*/ , node => {
                node.style.marginTop = '0px';
                node.style.marginBottom = '0px';
            });
        }
    });
}
