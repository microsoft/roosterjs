import Editor from '../editor/Editor';
import { Browser, fromHtml, Position } from 'roosterjs-editor-dom';

// Undo cursor marker
const CURSOR_START = 'cursor-start';
const CURSOR_END = 'cursor-end';
const CURSOR_MARKER_HTML = `<span id='${CURSOR_START}'></span><span id='${CURSOR_END}'></span>`;

/**
 * Build undo snapshot, remember current cursor position by inserting start and end cursor mark SPANs
 * @param editor The editor instance
 * @returns The snapshot HTML string
 */
export function buildSnapshot(editor: Editor): string {
    // Build the snapshot in-between adding and removing cursor marker
    addCursorMarkersToSelection(editor);

    let htmlContent = editor.getContent(false /*triggerExtractContentEvent*/) || '';

    // This extra update selection to cursor marker post building snapshot is added for Mac safari
    // We temporarily inject a cursor marker to current selection prior to build snapshot and remove it afterwards
    // The insertion of cursor marker for some reasons has caused the selection maintained in browser to be lost.
    // This restores the selection prior to removing the cursor marker.
    // The code may throw error for Firefox and IE, hence keep it only for Mac Safari
    if (Browser.isSafari) {
        updateSelectionToCursorMarkers(editor);
    }

    removeCursorMarkers(editor);
    return htmlContent;
}

/**
 * Restore a snapshot, set the cursor selection back to the position stored in the snapshot
 * @param editor The editor instance
 */
export function restoreSnapshot(editor: Editor, snapshot: string) {
    editor.setContent(snapshot, () => {
        // Restore the selection and delete the cursor marker afterwards
        updateSelectionToCursorMarkers(editor);
        removeCursorMarkers(editor);
    });
}

// Remove the temporarily added cursor markers
function removeCursorMarkers(editor: Editor) {
    [CURSOR_START, CURSOR_END].forEach(id => {
        let nodes = getCursorMarkNodes(editor, id);
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].parentNode.removeChild(nodes[i]);
            }
        }
    });
}

// Temporarily inject a SPAN marker to the selection which is used to remember where the selection is
// The marker is used on restore selection on undo
function addCursorMarkersToSelection(editor: Editor) {
    let range = editor.getSelectionRange();
    let markers = fromHtml(CURSOR_MARKER_HTML, editor.getDocument());

    insertCursorMarker(editor, range.start, markers[0]);

    // Then the end marker
    // For collapsed selection, use the start marker as the editor so that
    // the end marker is always placed after the start marker
    let rawRange = range.getRange();
    let endPosition = range.collapsed
        ? new Position(markers[0], Position.After)
        : new Position(rawRange.endContainer, rawRange.endOffset);
    insertCursorMarker(editor, endPosition, markers[1]);
}

// Update selection to where cursor marker is
// This is used in post building snapshot to restore selection
function updateSelectionToCursorMarkers(editor: Editor) {
    let startMarker = getCursorMarkerByUniqueId(editor, CURSOR_START);
    let endMarker = getCursorMarkerByUniqueId(editor, CURSOR_END);

    if (startMarker && endMarker) {
        editor.select(startMarker, Position.After, endMarker, Position.Before);
    }
}

// Insert cursor marker to an editor point
// The original code uses range.insertNode which "damages" some browser node & selection state
// i.e. on chrome, when the cursor is right at begin of a list, range.insertNode will cause some
// extra "empty" text node to be created as cursor marker is inserted. That extra "empty" text node
// will cause indentation to behave really weirdly
// This revised version uses DOM parentNode.insertBefore when it sees the insertion point is in node boundary_begin
// which gives precise control over DOM structure and solves the chrome issue
function insertCursorMarker(editor: Editor, position: Position, cursorMaker: Node) {
    position = position.normalize();
    let parentNode = position.node.parentNode;
    if (position.offset == 0) {
        parentNode.insertBefore(cursorMaker, position.node);
    } else if (position.isAtEnd) {
        // otherwise, insert after
        parentNode.insertBefore(cursorMaker, position.node.nextSibling);
    } else {
        // This is for insertion in-between a text node
        let insertionRange = editor.getDocument().createRange();
        insertionRange.setStart(position.node, position.offset);
        insertionRange.insertNode(cursorMaker);
    }
}

// Get an element by unique id. If there is more than one element by the id, it should return null
function getCursorMarkerByUniqueId(editor: Editor, id: string): Node {
    let nodes = getCursorMarkNodes(editor, id);
    return nodes && nodes.length == 1 ? nodes[0] : null;
}

function getCursorMarkNodes(editor: Editor, id: string): Node[] {
    return editor.queryNodes(`span[id="${id}"]:empty`);
}
