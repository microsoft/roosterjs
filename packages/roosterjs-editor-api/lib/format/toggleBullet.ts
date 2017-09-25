import execFormatWithUndo from './execFormatWithUndo';
import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { Editor, browserData } from 'roosterjs-editor-core';
import { NodeType } from 'roosterjs-editor-types';

// Edge may incorrectly put cursor after toggle bullet, workaround it by adding a space.
// The space will be removed by Edge after toggle bullet
export function workaroundForEdge(editor: Editor): boolean {
    if (browserData.isEdge) {
        let node = getNodeAtCursor(editor);
        if (node.nodeType == NodeType.Element && (<Element>node).textContent == '') {
            (<Element>node).textContent = ' ';
            return true;
        }
    }

    return false;
}

export function removeWorkaroundForEdge(editor: Editor) {
    let node = getNodeAtCursor(editor);
    if (node.nodeType == NodeType.Element && (<Element>node).textContent == ' ') {
        (<Element>node).textContent = '';
    }
}

export default function toggleBullet(editor: Editor): void {
    editor.focus();
    execFormatWithUndo(editor, () => {
        let hasWoraround = workaroundForEdge(editor);
        editor.getDocument().execCommand('insertUnorderedList', false, null);
        if (hasWoraround) {
            removeWorkaroundForEdge(editor);
        }
    });
}
