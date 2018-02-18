import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { unwrap } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';

/**
 * Remove link at selection. If no links at selection, do nothing.
 * If selection contains multiple links, all of the link styles will be removed.
 * If only part of a link is selected, the whole link style will be removed.
 * @param editor The editor instance
 */
export default function removeLink(editor: Editor) {
    editor.focus();
    let nodes = queryNodesWithSelection(editor, 'a[href]');
    if (nodes.length) {
        editor.formatWithUndo(() => {
            for (let node of nodes) {
                unwrap(node);
            }
        }, true /*preserveSelection*/);
    }
}
