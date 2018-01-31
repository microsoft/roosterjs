import Editor from '../editor/Editor';
import browserData from '../utils/BrowserData';
import { EditorPoint, NodeBoundary, NodeType } from 'roosterjs-editor-types';
import { normalizeEditorPoint } from 'roosterjs-editor-dom';

// Undo cursor marker
const CURSOR_START = 'cursor-start';
const CURSOR_END = 'cursor-end';

// Build undo snapshot
export function buildSnapshot(editor: Editor): string {
    // Build the snapshot in-between adding and removing cursor marker
    let selectionRange = editor.getRange();
    if (selectionRange) {
        addCursorMarkersToSelection(editor, selectionRange);
    }

    let htmlContent = editor.getContent(false /*triggerExtractContentEvent*/) || '';

    // This extra update selection to cursor marker post building snapshot is added for Mac safari
    // We temporarily inject a cursor marker to current selection prior to build snapshot and remove it afterwards
    // The insertion of cursor marker for some reasons has caused the selection maintained in browser to be lost.
    // This restores the selection prior to removing the cursor marker.
    // The code may throw error for Firefox and IE, hence keep it only for Mac Safari
    if (browserData.isSafari) {
        updateSelectionToCursorMarkers(editor);
    }

    removeCursorMarkers(editor);
    return htmlContent;
}

// Restore a snapshot
export function restoreSnapshot(editor: Editor, snapshot: string): void {
    editor.setContent(snapshot);

    // Restore the selection and delete the cursor marker afterwards
    updateSelectionToCursorMarkers(editor);
    removeCursorMarkers(editor);
}

// Remove the temporarily added cursor markers
function removeCursorMarkers(editor: Editor): void {
    removeCursorMarkerById(editor, CURSOR_START);
    removeCursorMarkerById(editor, CURSOR_END);
}

// Temporarily inject a SPAN marker to the selection which is used to remember where the selection is
// The marker is used on restore selection on undo
function addCursorMarkersToSelection(editor: Editor, selectionRange: Range): void {
    // First to insert the start marker
    let startMarker = createCursorMarker(editor, CURSOR_START);
    let startPoint = normalizeEditorPoint(
        selectionRange.startContainer,
        selectionRange.startOffset
    );
    insertCursorMarkerToEditorPoint(editor, startPoint, startMarker);

    // Then the end marker
    // For collapsed selection, use the start marker as the editor so that
    // the end marker is always placed after the start marker
    let endMarker = createCursorMarker(editor, CURSOR_END);
    let endPoint = selectionRange.collapsed
        ? { containerNode: startMarker, offset: NodeBoundary.End }
        : normalizeEditorPoint(selectionRange.endContainer, selectionRange.endOffset);
    insertCursorMarkerToEditorPoint(editor, endPoint, endMarker);
}

// Update selection to where cursor marker is
// This is used in post building snapshot to restore selection
function updateSelectionToCursorMarkers(editor: Editor) {
    let startMarker = getCursorMarkerByUniqueId(editor, CURSOR_START);
    let endMarker = getCursorMarkerByUniqueId(editor, CURSOR_END);

    if (startMarker && endMarker) {
        let selectionRange = editor.getDocument().createRange();
        selectionRange.setEndBefore(endMarker);
        selectionRange.setStartAfter(startMarker);
        editor.updateSelection(selectionRange);
    }
}

// Insert cursor marker to an editor point
// The original code uses range.insertNode which "damages" some browser node & selection state
// i.e. on chrome, when the cursor is right at begin of a list, range.insertNode will cause some
// extra "empty" text node to be created as cursor marker is inserted. That extra "empty" text node
// will cause indentation to behave really weirdly
// This revised version uses DOM parentNode.insertBefore when it sees the insertion point is in node boundary_begin
// which gives precise control over DOM structure and solves the chrome issue
function insertCursorMarkerToEditorPoint(
    editor: Editor,
    editorPoint: EditorPoint,
    cursorMaker: Element
): void {
    let containerNode = editorPoint.containerNode;
    let offset = editorPoint.offset;
    let parentNode = containerNode.parentNode;
    if (editorPoint.offset == NodeBoundary.Begin) {
        // For boundary_begin, insert the marker before the node
        parentNode.insertBefore(cursorMaker, containerNode);
    } else if (
        containerNode.nodeType == NodeType.Element ||
        (containerNode.nodeType == NodeType.Text &&
            editorPoint.offset == containerNode.nodeValue.length)
    ) {
        // otherwise, insert after
        parentNode.insertBefore(cursorMaker, containerNode.nextSibling);
    } else {
        // This is for insertion in-between a text node
        let insertionRange = editor.getDocument().createRange();
        insertionRange.setStart(containerNode, offset);
        insertionRange.collapse(true /* toStart */);
        insertionRange.insertNode(cursorMaker);
    }
}

// Remove an element from editor by Id
function removeCursorMarkerById(editor: Editor, id: string): void {
    let nodes = getCursorMarkNodes(editor, id);
    if (nodes) {
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].parentNode.removeChild(nodes[i]);
        }
    }
}

// Get an element by unique id. If there is more than one element by the id, it should return null
function getCursorMarkerByUniqueId(editor: Editor, id: string): Element {
    let nodes = getCursorMarkNodes(editor, id);
    return nodes && nodes.length == 1 ? nodes[0] : null;
}

function getCursorMarkNodes(editor: Editor, id: string): NodeListOf<Element> {
    return editor.queryContent(`span[id="${id}"]:empty`);
}

// Create a cursor marker by id
function createCursorMarker(editor: Editor, id: string): HTMLElement {
    let editorDocument = editor.getDocument();
    let cursorMarker = editorDocument.createElement('SPAN');
    cursorMarker.id = id;
    return cursorMarker;
}
