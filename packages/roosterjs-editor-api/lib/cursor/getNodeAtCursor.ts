import { Editor } from 'roosterjs-editor-core';
import { NodeType } from 'roosterjs-editor-types';

/**
 * Get the node at selection
 * if editor has focus, use selection.focusNode
 * if for some reason, the focus node does not get us a good node
 * fallback to the cached selection range if there is any
 * and use the start container if selection is collapsed or commonAncestorContainer otherwise
 * @param editor The editor instance
 * @returns The node at cursor
 */
export default function getNodeAtCursor(editor: Editor): Node {
    let node: Node = null;
    if (editor.hasFocus()) {
        let sel = editor.getSelection();
        node = sel ? sel.focusNode : null;
    }

    if (!node) {
        let selectionRange = editor.getSelectionRange();
        if (selectionRange) {
            node = selectionRange.collapsed
                ? selectionRange.startContainer
                : selectionRange.commonAncestorContainer;
        }
    }

    if (node && node.nodeType == NodeType.Text) {
        node = node.parentNode;
    }

    return node;
}
