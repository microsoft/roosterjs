import UndoSnapshot from './UndoSnapshot';
import { Editor, browserData } from 'roosterjs-core';
import { EditorPoint, NodeBoundary, NodeType } from 'roosterjs-types';
import { normalizeEditorPoint } from 'roosterjs-dom';

// Undo cursor marker
const CURSOR_START = 'cursor-start';
const CURSOR_END = 'cursor-end';

// Class that build snapshot and restore snapshot for editor
export default class SnapshotProvider {
    constructor(private editor: Editor) {}

    // Build undo snapshot
    public buildSnapshot(): UndoSnapshot {
        // TODO: re-test and add logic when we have the code to test browser
        // OM 2508743, if the line in which we'll be injecting cursor marker is not wrapped, i.e.
        // for html structure like: "<div contenteditable=true>a<br>b c</br></div>", when cursor is at end of "c",
        // and user press Space and then Backspace, cursor will jump. wrapping "b c<br>" with a P solves the problem
        // this.FixFirefoxWrapping();

        // Build the snapshot in-between adding and removing cursor marker
        let selectionRange = this.editor.getSelectionRange();
        if (selectionRange) {
            this.addCursorMarkersToSelection(selectionRange);
            let htmlContent = this.editor.getContent(false /*triggerExtractContentEvent*/);
            if (!htmlContent) {
                htmlContent = '';
            }

            // This extra update selection to cursor marker post building snapshot is added for Mac safari
            // We temporarily inject a cursor marker to current selection prior to build snapshot and remove it afterwards
            // The insertion of cursor marker for some reasons has caused the selection maintained in browser to be lost.
            // This restores the selection prior to removing the cursor marker.
            // The code may throw error for Firefox and IE, hence keep it only for Mac Safari
            if (browserData.isSafari) {
                this.updateSelectionToCursorMarkers();
            }

            this.removeCursorMarkers();
            return { data: htmlContent, length: htmlContent.length };
        }

        return null;
    }

    // Restore a snapshot
    public restoreSnapshot(snapshot: UndoSnapshot): void {
        this.editor.setContent(snapshot.data);

        // Restore the selection and delete the cursor marker afterwards
        this.updateSelectionToCursorMarkers();
        this.removeCursorMarkers();
    }

    // Remove the temporarily added cursor markers
    private removeCursorMarkers(): void {
        this.removeCursorMarkerById(CURSOR_START);
        this.removeCursorMarkerById(CURSOR_END);
    }

    // Temporarily inject a SPAN marker to the selection which is used to remember where the selection is
    // The marker is used on restore selection on undo
    private addCursorMarkersToSelection(selectionRange: Range): void {
        // First to insert the start marker
        let startMarker = this.createCursorMarker(CURSOR_START);
        let startPoint = normalizeEditorPoint(
            selectionRange.startContainer,
            selectionRange.startOffset
        );
        this.insertCursorMarkerToEditorPoint(startPoint, startMarker);

        // Then the end marker
        // For collapsed selection, use the start marker as the editor so that
        // the end marker is always placed after the start marker
        let endMarker = this.createCursorMarker(CURSOR_END);
        let endPoint = selectionRange.collapsed
            ? { containerNode: startMarker, offset: NodeBoundary.End }
            : normalizeEditorPoint(selectionRange.endContainer, selectionRange.endOffset);
        this.insertCursorMarkerToEditorPoint(endPoint, endMarker);
    }

    // Update selection to where cursor marker is
    // This is used in post building snapshot to restore selection
    private updateSelectionToCursorMarkers(): boolean {
        let startMarker = this.getCursorMarkerByUniqueId(CURSOR_START);
        let endMarker = this.getCursorMarkerByUniqueId(CURSOR_END);

        if (startMarker && endMarker) {
            let selectionRange = this.editor.getDocument().createRange();
            selectionRange.setEndBefore(endMarker);
            selectionRange.setStartAfter(startMarker);
            return this.editor.updateSelection(selectionRange);
        }

        return false;
    }

    // Insert cursor marker to an editor point
    // The original code uses range.insertNode which "damages" some browser node & selection state
    // i.e. on chrome, when the cursor is right at begin of a list, range.insertNode will cause some
    // extra "empty" text node to be created as cursor marker is inserted. That extra "empty" text node
    // will cause indentation to behave really weirdly
    // This revised version uses DOM parentNode.insertBefore when it sees the insertion point is in node boundary_begin
    // which gives precise control over DOM structure and solves the chrome issue
    private insertCursorMarkerToEditorPoint(editorPoint: EditorPoint, cursorMaker: Element): void {
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
            let insertionRange = this.editor.getDocument().createRange();
            insertionRange.setStart(containerNode, offset);
            insertionRange.collapse(true /* toStart */);
            insertionRange.insertNode(cursorMaker);
        }
    }

    // Remove an element from editor by Id
    private removeCursorMarkerById(id: string): void {
        let nodes = this.getCursorMarkNodes(id);
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].parentNode.removeChild(nodes[i]);
            }
        }
    }

    // Get an element by unique id. If there is more than one element by the id, it should return null
    private getCursorMarkerByUniqueId(id: string): Element {
        let nodes = this.getCursorMarkNodes(id);
        return nodes && nodes.length == 1 ? nodes[0] : null;
    }

    private getCursorMarkNodes(id: string): NodeListOf<Element> {
        return this.editor.queryContent(`span[id="${id}"]:empty`);
    }

    // Create a cursor marker by id
    private createCursorMarker(id: string): HTMLElement {
        let editorDocument = this.editor.getDocument();
        let cursorMarker = editorDocument.createElement('SPAN');
        cursorMarker.id = id;
        return cursorMarker;
    }
}
