import EditorCore from '../editor/EditorCore';
import isVoidHtmlElement from '../utils/isVoidHtmlElement';
import {
    contains,
    getFirstLeafNode,
    isDocumentPosition,
    normalizeEditorPoint,
} from 'roosterjs-editor-dom';
import { DocumentPosition, NodeBoundary, NodeType, Rect } from 'roosterjs-editor-types';

export function hasFocus(core: EditorCore): boolean {
    let activeElement = core.document.activeElement;
    return (
        activeElement &&
        (core.contentDiv == activeElement || contains(core.contentDiv, activeElement))
    );
}

export function getSelection(core: EditorCore) {
    let win = (core.document || document).defaultView || window;
    return win.getSelection();
}

export function getSelectionRange(core: EditorCore, tryGetFromCache: boolean): Range {
    let result: Range = null;

    if (!tryGetFromCache || hasFocus(core)) {
        let selection = getSelection(core);
        if (selection && selection.rangeCount > 0) {
            let range = selection.getRangeAt(0);
            if (isRangeInContainer(range, core.contentDiv)) {
                result = range;
            }
        }
    }

    if (!result && tryGetFromCache) {
        result = core.cachedSelectionRange;
    }

    return result;
}

export function focus(core: EditorCore) {
    if (!hasFocus(core) || !getSelectionRange(core, false /*tryGetFromCache*/)) {
        // Focus (document.activeElement indicates) and selection are mostly in sync, but could be out of sync in some extreme cases.
        // i.e. if you programmatically change window selection to point to a non-focusable DOM element (i.e. tabindex=-1 etc.).
        // On Chrome/Firefox, it does not change document.activeElement. On Edge/IE, it change document.activeElement to be body
        // Although on Chrome/Firefox, document.activeElement points to editor, you cannot really type which we don't want (no cursor).
        // So here we always do a live selection pull on DOM and make it point in Editor. The pitfall is, the cursor could be reset
        // to very begin to of editor since we don't really have last saved selection (created on blur which does not fire in this case).
        // It should be better than the case you cannot type
        if (!restoreSelection(core)) {
            setSelectionToBegin(core);
        }
    }

    // remember to clear cachedSelectionRange
    core.cachedSelectionRange = null;

    // This is more a fallback to ensure editor gets focus if it didn't manage to move focus to editor
    if (!hasFocus(core)) {
        core.contentDiv.focus();
    }
}

export function updateSelection(core: EditorCore, range: Range): boolean {
    let selectionUpdated = false;
    if (isRangeInContainer(range, core.contentDiv)) {
        let selection = getSelection(core);
        if (selection) {
            if (selection.rangeCount > 0) {
                selection.removeAllRanges();
            }

            selection.addRange(range);
            if (!hasFocus(core)) {
                core.cachedSelectionRange = range;
            }

            selectionUpdated = true;
        }
    }

    return selectionUpdated;
}

export function restoreSelection(core: EditorCore): boolean {
    let selectionRestored = false;
    if (core.cachedSelectionRange) {
        selectionRestored = updateSelection(core, core.cachedSelectionRange);
    }

    return selectionRestored;
}

export function saveSelectionRange(core: EditorCore) {
    core.cachedSelectionRange = getSelectionRange(core, false /*tryGetFromCache*/);
}

// Returns a rect representing the location of the cursor.
// In case there is a uncollapsed selection witin editor, this returns
// the position for focus node.
// The returned rect structure has a left and right and they should be same
// here since it is for cursor, not for a range.
export function getCursorRect(core: EditorCore): Rect {
    let range = getSelectionRange(core, false /*tryGetFromCache*/);

    if (!range) {
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
        let selection = getSelection(core);
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
            let nearbyRange = core.document.createRange();
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

function setSelectionToBegin(core: EditorCore) {
    let range: Range;
    let firstNode = getFirstLeafNode(core.contentDiv);
    if (firstNode) {
        if (firstNode.nodeType == NodeType.Text) {
            // First node is text, move range to the begin
            range = core.document.createRange();
            range.setStart(firstNode, 0);
        } else if (firstNode.nodeType == NodeType.Element) {
            if (isVoidHtmlElement(firstNode as HTMLElement)) {
                // First node is a html void element (void elements cannot have child nodes), move range before it
                range = core.document.createRange();
                range.setStartBefore(firstNode);
            } else {
                // Other html element, move range inside it
                range = core.document.createRange();
                range.setStart(firstNode, 0);
            }
        }
    } else {
        // No first node, likely we have an empty content DIV, move range inside it
        range = core.document.createRange();
        range.setStart(core.contentDiv, 0);
    }

    if (range) {
        updateSelection(core, range);
    }
}

// Checks if a range falls within the content Div
function isRangeInContainer(range: Range, container: Node): boolean {
    let ancestorContainer = range ? range.commonAncestorContainer : null;

    // use the parentNode if ancestorContainer is a text node
    if (ancestorContainer && ancestorContainer.nodeType == NodeType.Text) {
        ancestorContainer = ancestorContainer.parentNode;
    }

    return (
        ancestorContainer &&
        (container == ancestorContainer || container.contains(ancestorContainer))
    );
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
