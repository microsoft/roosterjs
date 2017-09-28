import UndoSnapshots from './UndoSnapshots';
import containsImage from './containsImage';
import {
    ContentChangedEvent,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import Editor from '../editor/Editor';
import UndoService from '../editor/UndoService';
import { buildSnapshot, restoreSnapshot} from './snapshotUtils';

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_SPACE = 32;
const KEY_ENTER = 13;
const KEY_PAGEUP = 33;
const KEY_DOWN = 40;

/**
 * Provides snapshot based undo service for Editor
 */
export default class Undo implements UndoService {
    private editor: Editor;
    private isRestoring: boolean;
    private hasNewContent: boolean;
    private undoSnapshots: UndoSnapshots;
    private lastKeyPress: number;

    /**
     * Create an instance of Undo
     * @param preserveSnapshots True to preserve the snapshots after dispose, this allows
     * this object to be reused when editor is disposed and created again
     */
    constructor(
        private preserveSnapshots?: boolean) {}

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;

        // Add an initial snapshot if snapshotsManager isn't created yet
        if (!this.undoSnapshots) {
            this.addUndoSnapshot();
        }
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.editor = null;

        if (!this.preserveSnapshots) {
            this.clear();
        }
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
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
                this.clearRedoForInput();
                break;
            case PluginEventType.ContentChanged:
                if ((<ContentChangedEvent>event).source != 'Undo' && !this.isRestoring) {
                    this.clearRedoForInput();
                }
                break;
        }
    }

    /**
     * Clear all existing undo snapshots
     */
    public clear() {
        this.undoSnapshots = null;
        this.hasNewContent = false;
    }

    /**
     * Restore an undo snapshot to editor
     */
    public undo(): void {
        if (this.hasNewContent) {
            this.addUndoSnapshot();
        }

        this.restoreSnapshot(-1 /*previousSnapshot*/);
    }

    /**
     * Restore a redo snapshot to editor
     */
    public redo(): void {
        this.restoreSnapshot(1 /*nextSnapshot*/);
    }

    /**
     * Whether there is a snapshot for undo
     */
    public canUndo(): boolean {
        return this.hasNewContent || this.getSnapshotsManager().canMove(-1 /*previousSnapshot*/);
    }

    /**
     * Whether there is a snapshot for redo
     */
    public canRedo(): boolean {
        return this.getSnapshotsManager().canMove(1 /*nextSnapshot*/);
    }

    /**
     * Add an undo snapshot
     */
    public addUndoSnapshot(): void {
        let snapshot = buildSnapshot(this.editor);
        this.getSnapshotsManager().addSnapshot(snapshot);
        this.hasNewContent = false;
    }

    private restoreSnapshot(delta: number) {
        let snapshot = this.getSnapshotsManager().move(delta);

        if (snapshot) {
            try {
                this.isRestoring = true;
                restoreSnapshot(this.editor, snapshot);
            } finally {
                this.isRestoring = false;
            }

            this.fireContentChangedEvent();
        }
    }

    private onKeyDown(pluginEvent: PluginDomEvent): void {
        // Handle backspace/delete when there is a selection to take a snapshot
        // since we want the state prior to deletion restorable
        let evt = pluginEvent.rawEvent as KeyboardEvent;
        let shouldTakeUndo = false;
        if (evt.which == KEY_BACKSPACE || evt.which == KEY_DELETE) {
            let selectionRange = this.editor.getSelectionRange();
            if (
                selectionRange &&
                (!selectionRange.collapsed ||
                    // If the selection contains image, we need to add undo snapshots
                    containsImage(selectionRange.startContainer))
            ) {
                shouldTakeUndo = true;
            }
        } else if (this.hasNewContent && evt.which >= KEY_PAGEUP && evt.which <= KEY_DOWN) {
            shouldTakeUndo = true;
        }

        if (shouldTakeUndo) {
            this.addUndoSnapshot();
            this.lastKeyPress = 0;
        }
    }

    private onKeyPress(pluginEvent: PluginDomEvent): void {
        let evt = pluginEvent.rawEvent as KeyboardEvent;
        if (evt.metaKey) {
            // if metaKey is pressed, simply return since no actual effect will be taken on the editor.
            // this is to prevent changing hasNewContent to true when âŒ˜ + v to paste on Safari.
            return;
        }

        let shouldTakeUndo = false;
        let selectionRange = this.editor.getSelectionRange();
        if (selectionRange && !selectionRange.collapsed) {
            // The selection will be removed, should take undo
            shouldTakeUndo = true;
        } else if ((evt.which == KEY_SPACE && this.lastKeyPress != KEY_SPACE) || evt.which == KEY_ENTER) {
            shouldTakeUndo = true;
        }

        if (shouldTakeUndo) {
            this.addUndoSnapshot();
        } else {
            this.clearRedoForInput();
        }

        this.lastKeyPress = evt.which;
    }

    private clearRedoForInput() {
        this.getSnapshotsManager().clearRedo();
        this.lastKeyPress = 0;
        this.hasNewContent = true;
    }

    private fireContentChangedEvent(): void {
        let changeEvent: ContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            source: 'Undo',
        };
        this.editor.triggerEvent(changeEvent, true /* broadcast */);
    }

    private getSnapshotsManager() {
        if (!this.undoSnapshots) {
            this.undoSnapshots = new UndoSnapshots();
        }
        return this.undoSnapshots;
    }
}
