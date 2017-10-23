import execFormatWithUndo from './execFormatWithUndo';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { unwrap } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';

export default function removeLink(editor: Editor): void {
    editor.focus();
    let nodes = queryNodesWithSelection(editor, 'a[href]');
    if (nodes.length) {
        execFormatWithUndo(editor, () => {
            for (let node of nodes) {
                unwrap(node);
            }
        });
    }
}
