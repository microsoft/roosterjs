import { DocumentPosition, NodeBoundary, NodeType, Rect } from 'roosterjs-editor-types';
import { isDocumentPosition, normalizeEditorPoint } from 'roosterjs-editor-dom';
import { tryGetSelectionRange, getSelection } from './selection';

function getRectFromClientRect(clientRect: ClientRect): Rect {
    // A ClientRect of all 0 is possible. i.e. chrome returns a ClientRect of 0 when the cursor is on an empty p
    // We validate that and only return a rect when the passed in ClientRect is valid
    return clientRect &&
        (clientRect.left != 0 ||
            clientRect.right != 0 ||
            clientRect.left != 0 ||
            clientRect.right != 0)
        ? {
              left: Math.round(clientRect.left),
              right: Math.round(clientRect.right),
              top: Math.round(clientRect.top),
              bottom: Math.round(clientRect.bottom),
          }
        : null;
}

/**
 * Returns a rect representing the location of the cursor.
 * In case there is a uncollapsed selection witin editor, this returns
 * the position for focus node.
 * The returned rect structure has a left and right and they should be same
 * here since it is for cursor, not for a range.
 * @param container The container node
 * @returns The Rect
 */
function getCursorRect(container: Node): Rect {
    let document = container.ownerDocument;
    let range = tryGetSelectionRange(container);
    if (!range) {
        // Obtaining cursor position requires a selection range.
        // When there is no selection range, we have nothing to do but to return.
        return null;
    }

    // There isn't a browser API that gets you position of cursor.
    // Different browsers emit slightly different behaviours and there is no a single API that
    // can help achieve the goal across all browsers. At high level, we try to achieve the goal
    // by below approach:
    // 1) first, obtain a collapsed range pointing to cursor
    // 2) try to get rect using range.getBoundingClientRect()
    // 3）fallback to a nearby range.getBoundingClientRect()
    // 4) fallback range.getClientRects()
    // 5) lastly fallback range.startContainer.getBoundingClientRect()

    // 1) obtain a collapsed range pointing to cursor
    if (!range.collapsed) {
        // Range is not collapsed, collapse to cursor first
        let selection = getSelection(document);
        if (selection && selection.focusNode && selection.anchorNode) {
            let forwardSelection =
                selection.focusNode == selection.anchorNode
                    ? selection.focusOffset > selection.anchorOffset
                    : isDocumentPosition(
                          selection.anchorNode.compareDocumentPosition(selection.focusNode),
                          DocumentPosition.Following
                      );
            range = range.cloneRange();
            range.collapse(!forwardSelection /*toStart*/);
        }
    }

    // 2) try to get rect using range.getBoundingClientRect()
    let rect = getRectFromClientRect(range.getBoundingClientRect());

    // 3）fallback to a nearby range.getBoundingClientRect()
    if (!rect) {
        // This is often the case the cursor runs in middle of two nodes.
        // i.e. <p>{cursor}<br></p>, or <p><img ...>{cursor}text</p>.
        // range.getBoundingClientRect mostly return a client rect of all 0
        // Skip this if we're in middle of a text node
        let editorPoint = normalizeEditorPoint(range.startContainer, range.startOffset);
        if (
            editorPoint.containerNode.nodeType != NodeType.Text ||
            editorPoint.containerNode.nodeValue.length == editorPoint.offset
        ) {
            let nearbyRange = document.createRange();
            nearbyRange.selectNode(editorPoint.containerNode);
            rect = getRectFromClientRect(nearbyRange.getBoundingClientRect());
            if (rect) {
                // Fix the position to boundary of the nearby range
                rect.left = rect.right =
                    editorPoint.offset == NodeBoundary.Begin ? rect.left : rect.right;
            }
        }
    }

    // 4) fallback range.getClientRects()
    if (!rect) {
        // This is often the case Safari when cursor runs in middle of text node
        // range.getBoundingClientRect() returns a all 0 client rect.
        // range.getClientRects() returns a good client rect
        let clientRects = range.getClientRects();
        if (clientRects && clientRects.length == 1) {
            rect = getRectFromClientRect(clientRects[0]);
        }
    }

    // 5) lastly fallback range.startContainer.getBoundingClientRect()
    if (!rect && range.startContainer instanceof Element) {
        rect = getRectFromClientRect((range.startContainer as Element).getBoundingClientRect());
    }

    return rect;
}

export default getCursorRect;
