import SnapshotProvider from './SnapshotProvider';
import UndoSnapshot from './UndoSnapshot';
import containsImage from './containsImage';
import {
    ContentChangedEvent,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { cacheGetCursorEventData } from 'roosterjs-editor-api';
import { Editor, UndoService } from 'roosterjs-editor-core';

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_SPACE = 32;
const KEY_ENTER = 13;

// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAXSIZELIMIT = 10000000;

// Max number of snapshot to keep in undo stack
const MAXSNAPSHOTLIMIT = 50;

/**
 * @deprecated
 * An editor plugin that manages undo history
 */
export default class HtmlSnapshotUndo implements UndoService {
    private editor: Editor;

    // We use an array-based stack to store snapshot
    private undoRedoStack: UndoSnapshot[];

    // The snapshot provider
    private snapshotProvider: SnapshotProvider;

    // This points to the top of Undo stack + 1, essentially
    // the next available spot for a new undo
    private stackPos: number;

    // The stack size, used to limit memory taken by undo
    private stackSize: number;

    // Flag tracking if we're in undo sequence
    // This is marked after an undo is requested, and reset to false
    // once a change is seen which should break us out of the undo sequence
    private inUndoSequence: boolean;

    // Flag tracking if we're in redo sequence
    // This is marked after an redo is requested, and reset to false
    // once a change is seen which should break us out of the redo sequence
    private inRedoSequence: boolean;

    // Flag indicating if content has been changed since last undo was taken
    // The flag also implies if the content in editor diff from the last undo in stack.
    // This is important as when you do a undo, we need to check contentChangedSinceLastUndoAdded
    // if it is false (implies no change), we should skip restore an undo before last undo. Otherwise, we
    // just restore same thing which to user is like undo does nothing
    private contentChangedSinceLastUndoAdded: boolean;

    // snapshotOnSpace is to create a snapshot on Enter
    // snapshotOnEnter is to create a snapshot on Space
    constructor(private snapshotOnSpace: boolean = true, private snapshotOnEnter: boolean = true) {}

    // Initialize the undo manager plugin
    public initialize(editor: Editor): void {
        this.editor = editor;
        this.snapshotProvider = new SnapshotProvider(this.editor);
        this.resetStack();
    }

    // Dispose the plugin
    public dispose() {
        this.editor = null;
        this.snapshotProvider = null;
        this.resetStack();
    }

    public onPluginEvent(event: PluginEvent): void {
        // if editor is in IME, don't do anything
        if (this.editor.isInIME()) {
            return;
        }

        switch (event.eventType) {
            case PluginEventType.KeyDown:
                this.onKeyDown(event as PluginDomEvent);
                break;
            case PluginEventType.KeyPress:
                this.onKeyPress(event as PluginDomEvent);
                break;
            case PluginEventType.CompositionEnd:
                this.onCompositionEnd(event as PluginDomEvent);
                break;
            case PluginEventType.ContentChanged:
                this.onContentChanged(event as ContentChangedEvent);
                break;
        }
    }

    // Undo a change
    public undo(): void {
        if (!this.canUndo()) {
            return;
        }

        // Content has changed since last undo is added
        // need to clear the redo stack and add a new redo so that it can be restored as a redo
        if (this.contentChangedSinceLastUndoAdded) {
            this.clearRedo();
            this.addRedoSnapshot();
        }

        // Move the stack position by one step first
        this.stackPos--;

        // If contentChangedSinceLastUndoAdded hasn't been changed, it means we should move another step backward
        // unless we're in an undo sequence
        if (!this.inUndoSequence && !this.contentChangedSinceLastUndoAdded && this.stackPos > 0) {
            this.stackPos--;
        }

        let snapshot = this.undoRedoStack[this.stackPos];
        this.snapshotProvider.restoreSnapshot(snapshot);
        this.fireContentChangedEvent();
        this.contentChangedSinceLastUndoAdded = false;
        this.inUndoSequence = true;
        this.inRedoSequence = false;
    }

    // redo a change
    public redo(): void {
        if (!this.canRedo()) {
            return;
        }

        // If contentChangedSinceLastUndoAdded hasn't been changed, it means we should move another step forward
        // unless we're in an redo sequence
        if (
            !this.inRedoSequence &&
            !this.contentChangedSinceLastUndoAdded &&
            this.undoRedoStack.length > this.stackPos + 1
        ) {
            this.stackPos++;
        }
        let snapshot = this.undoRedoStack[this.stackPos];
        this.snapshotProvider.restoreSnapshot(snapshot);
        this.fireContentChangedEvent();
        this.stackPos++;
        this.inRedoSequence = true;
        this.inUndoSequence = false;
    }

    // Can undo
    public canUndo(): boolean {
        return this.stackPos > 0;
    }

    // Can redo
    public canRedo(): boolean {
        // The first item that can be restored from undo stack is at stackPos
        return this.undoRedoStack.length > this.stackPos;
    }

    // Add an undo snapshot
    public addUndoSnapshot(): void {
        // Ignore the add undo when:
        // 1) No change since last undo
        // 2) the stack is not empty (we still want to create undo when the stack is empty)
        if (!this.contentChangedSinceLastUndoAdded && this.stackPos > 1) {
            return;
        }

        let snapshot = this.snapshotProvider.buildSnapshot();
        if (snapshot) {
            this.clearRedo();
            this.undoRedoStack.push(snapshot);
            this.stackPos++;
            this.stackSize = this.stackSize + snapshot.length;
            this.ensureStackUnderLimit();
            this.contentChangedSinceLastUndoAdded = false;
            this.resetUndoRedoFlags();
        }
    }

    private addRedoSnapshot(): void {
        let snapshot = this.snapshotProvider.buildSnapshot();
        if (snapshot) {
            this.undoRedoStack.push(snapshot);
            this.stackSize = this.stackSize + snapshot.length;
        }
    }

    // Reset the stack
    private resetStack(): void {
        this.undoRedoStack = [];
        this.stackPos = 0;
        this.stackSize = 0;
        this.contentChangedSinceLastUndoAdded = false;
        this.resetUndoRedoFlags();
    }

    // Clear redo
    private clearRedo(): void {
        while (this.undoRedoStack.length > this.stackPos) {
            let droppedSnapshot = this.undoRedoStack.pop() as UndoSnapshot;
            this.stackSize = this.stackSize - droppedSnapshot.length;
        }
    }

    // Ensure stack size is under limit
    private ensureStackUnderLimit() {
        while (this.stackSize > MAXSIZELIMIT || this.undoRedoStack.length > MAXSNAPSHOTLIMIT) {
            // Ensure that we keep at least one undo snapshot
            if (this.stackPos <= 1) {
                break;
            }

            let droppedSnapshot = this.undoRedoStack.shift() as UndoSnapshot;
            this.stackSize = this.stackSize - droppedSnapshot.length;
            this.stackPos--;
        }
    }

    // On key down
    private onKeyDown(pluginEvent: PluginDomEvent): void {
        // Handle backspace/delete when there is a selection to take a snapshot
        // since we want the state prior to deletion restorable
        let evt = pluginEvent.rawEvent as KeyboardEvent;
        if (evt.which == KEY_BACKSPACE || evt.which == KEY_DELETE) {
            let selectionRange = this.editor.getSelectionRange();
            if (
                selectionRange &&
                (!selectionRange.collapsed ||
                    // If the selection contains image, we need to add undo snapshots
                    containsImage(selectionRange.startContainer))
            ) {
                this.addUndoSnapshot();
            }
        }
    }

    // On key press
    private onKeyPress(pluginEvent: PluginDomEvent): void {
        let evt = pluginEvent.rawEvent as KeyboardEvent;
        if (evt.metaKey) {
            // if metaKey is pressed, simply return since no actual effect will be taken on the editor.
            // this is to prevent changing contentChangedSinceLastUndoAdded to true when ⌘ + v to paste on Safari.
            return;
        }

        let shouldTakeUndo = false;
        let selectionRange = this.editor.getSelectionRange();
        if (selectionRange && !selectionRange.collapsed) {
            // The selection will be removed, should take undo
            shouldTakeUndo = true;
        } else if (this.snapshotOnSpace && evt.which == KEY_SPACE) {
            // Default to take undo for Space
            shouldTakeUndo = true;
            // Check the char before cursor to see if it is a space, and if so, don't take undo
            let cursorData = cacheGetCursorEventData(pluginEvent, this.editor);
            let strBeforeCursor = cursorData ? cursorData.getXCharsBeforeCursor(1) : null;
            let charBeforeCursor =
                strBeforeCursor && strBeforeCursor.length > 0 ? strBeforeCursor.charCodeAt(0) : 0;
            // 32 is for space, 160 is non-breaking space
            if (charBeforeCursor > 0 && (charBeforeCursor == 32 || charBeforeCursor == 160)) {
                shouldTakeUndo = false;
            }
        } else if (this.snapshotOnEnter && evt.which == KEY_ENTER) {
            shouldTakeUndo = true;
        }

        if (shouldTakeUndo) {
            this.addUndoSnapshot();
        }

        // We know there is a change since it is a keypress
        this.contentChangedSinceLastUndoAdded = true;
        this.resetUndoRedoFlags();
    }

    // On composition end
    private onCompositionEnd(pluginEvent: PluginDomEvent): void {
        this.contentChangedSinceLastUndoAdded = true;
        this.resetUndoRedoFlags();
    }

    // On content changed
    private onContentChanged(event: ContentChangedEvent): void {
        if (event.source != 'Undo') {
            this.contentChangedSinceLastUndoAdded = true;
            this.resetUndoRedoFlags();
        }
    }

    // Fire an undo content changed event
    private fireContentChangedEvent(): void {
        let changeEvent: ContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            source: 'Undo',
        };
        this.editor.triggerEvent(changeEvent, true /* broadcast */);
    }

    // Reset the undo/redo flags
    private resetUndoRedoFlags(): void {
        this.inUndoSequence = false;
        this.inRedoSequence = false;
    }
}
