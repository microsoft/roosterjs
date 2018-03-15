import { Editor } from 'roosterjs-editor-core';
import { Position } from 'roosterjs-editor-dom';
import { Rect, NodeType } from 'roosterjs-editor-types';

/**
 * Returns a rect representing the location of the cursor.
 * In case there is a uncollapsed selection witin editor, this returns
 * the position for focus node.
 * The returned rect structure has a left and right and they should be same
 * here since it is for cursor, not for a range.
 */
export default function getCursorRect(editor: Editor): Rect {
    let range = editor.getSelectionRange().getRange();
    let document = editor.getDocument();

    // 1) obtain a collapsed range pointing to cursor
    if (!range.collapsed) {
        let selection = document.defaultView.getSelection();

        if (!selection || !selection.focusNode) {
            return null;
        }

        let forwardSelection =
            range.endContainer == selection.focusNode && range.endOffset == selection.focusOffset;
        range = range.cloneRange();
        range.collapse(!forwardSelection /*toStart*/);
    }

    // 2) try to get rect using range.getBoundingClientRect()
    let rect = getRectFromClientRect(range.getBoundingClientRect());

    if (!rect) {
        let position = new Position(range.startContainer, range.startOffset).normalize();
        let node = position.node;

        // 3) if current cursor is inside text node, insert a SPAN and get the rect of SPAN
        if (node.nodeType == NodeType.Text) {
            let span = document.createElement('SPAN');
            range = document.createRange();
            range.setStart(node, position.offset);
            range.collapse(true /*toStart*/);
            range.insertNode(span);
            rect = getRectFromClientRect(span.getBoundingClientRect());
            span.parentNode.removeChild(span);
        }

        // 4) fallback to element.getBoundingClientRect()
        if (!rect) {
            node = node.nodeType == NodeType.Element ? node : node.parentNode;
            if (node && node.nodeType == NodeType.Element) {
                rect = getRectFromClientRect((<Element>node).getBoundingClientRect());
            }
        }
    }

    return rect;
}

function getRectFromClientRect(clientRect: ClientRect): Rect {
    // A ClientRect of all 0 is possible. i.e. chrome returns a ClientRect of 0 when the cursor is on an empty p
    // We validate that and only return a rect when the passed in ClientRect is valid
    if (!clientRect) {
        return null;
    }
    let { left, right, top, bottom } = clientRect;
    return left + right + top + bottom > 0
        ? {
              left: Math.round(left),
              right: Math.round(right),
              top: Math.round(top),
              bottom: Math.round(bottom),
          }
        : null;
}
