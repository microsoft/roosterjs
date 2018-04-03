import EditorCore from '../editor/EditorCore';
import getSelection from './getSelection';
import getSelectionRange from './getSelectionRange';
import { Rect, NodeType } from 'roosterjs-editor-types';
import { normalizeEditorPoint, isEditorPointAfter } from 'roosterjs-editor-dom';
import browserData from '../utils/BrowserData';

/**
 * Returns a rect representing the location of the cursor.
 * In case there is a uncollapsed selection witin editor, this returns
 * the position for focus node.
 * The returned rect structure has a left and right and they should be same
 * here since it is for cursor, not for a range.
 */
export default function getCursorRect(core: EditorCore): Rect {
    let selection = getSelection(core);
    let range = getSelectionRange(core, false /*tryGetFromCache*/);

    if (!range || !selection || !selection.focusNode || !selection.anchorNode) {
        return null;
    }

    let focusPosition = normalizeEditorPoint(selection.focusNode, selection.focusOffset);
    let node = focusPosition.containerNode;
    // 1) obtain a collapsed range pointing to cursor
    if (!range.collapsed) {
        let forwardSelection = isEditorPointAfter(
            focusPosition,
            normalizeEditorPoint(selection.anchorNode, selection.anchorOffset)
        );
        range = range.cloneRange();
        range.collapse(!forwardSelection /*toStart*/);
    }

    // 2) try to get rect using range.getBoundingClientRect()
    let rect = getRectFromClientRect(range.getBoundingClientRect());

    // 3) if current cursor is inside text node, use range.getClientRects() for safari or insert a SPAN and get the rect of SPAN for others
    if (!rect) {
        if (browserData.isSafari) {
            let rects = range.getClientRects();
            if (rects && rects.length == 1) {
                rect = getRectFromClientRect(rects[0]);
            }
        } else {
            if (!rect && node.nodeType == NodeType.Text) {
                let document = core.document;
                let span = document.createElement('SPAN');
                let range = document.createRange();
                range.setStart(node, focusPosition.offset);
                range.collapse(true /*toStart*/);
                range.insertNode(span);
                rect = getRectFromClientRect(span.getBoundingClientRect());
                span.parentNode.removeChild(span);
            }
        }
    }

    // 4) fallback to element.getBoundingClientRect()
    if (!rect) {
        node = node.nodeType == NodeType.Element ? node : node.parentNode;
        if (node && node.nodeType == NodeType.Element) {
            rect = getRectFromClientRect((<Element>node).getBoundingClientRect());
        }
    }

    return rect;
}

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
