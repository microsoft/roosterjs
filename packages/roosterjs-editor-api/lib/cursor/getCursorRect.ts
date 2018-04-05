import { Editor } from 'roosterjs-editor-core';
import { Browser, Position } from 'roosterjs-editor-dom';
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
        let { node, element } = position;

        // 3) if current cursor is inside text node, use range.getClientRects() for safari or insert a SPAN and get the rect of SPAN for others
        if (Browser.isSafari) {
            let rects = range.getClientRects();
            if (rects && rects.length == 1) {
                rect = getRectFromClientRect(rects[0]);
            }
        } else {
            if (node.nodeType == NodeType.Text) {
                let document = editor.getDocument();
                let span = document.createElement('SPAN');
                let range = document.createRange();
                range.setStart(node, position.offset);
                range.collapse(true /*toStart*/);
                range.insertNode(span);
                rect = getRectFromClientRect(span.getBoundingClientRect());
                span.parentNode.removeChild(span);
            }
        }

        // 4) fallback to element.getBoundingClientRect()
        if (!rect && element) {
            rect = getRectFromClientRect(element.getBoundingClientRect());
        }
    }

    return rect;
}

function getRectFromClientRect(clientRect: ClientRect): Rect {
    // A ClientRect of all 0 is possible. i.e. chrome returns a ClientRect of 0 when the cursor is on an empty p
    // We validate that and only return a rect when the passed in ClientRect is valid
    let { left, right, top, bottom } = clientRect || <ClientRect>{};
    return left + right + top + bottom > 0
        ? {
              left: Math.round(left),
              right: Math.round(right),
              top: Math.round(top),
              bottom: Math.round(bottom),
          }
        : null;
}
