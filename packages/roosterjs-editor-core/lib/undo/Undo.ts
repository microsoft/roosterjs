import Editor from '../editor/Editor';
import UndoService from '../editor/UndoService';
import UndoSnapshots, { UndoSnapshotsService } from './UndoSnapshots';
import {
    ChangeSource,
    PluginEvent,
    PluginEventType,
    ContentChangedEvent,
} from 'roosterjs-editor-types';

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
    private lastKeyPress: number;
    private onDropDisposer: () => void;
    private onCutDisposer: () => void;
    public name = 'Undo';

    protected undoSnapshots: UndoSnapshotsService;

    /**
     * Create an instance of Undo
     * @param preserveSnapshots True to preserve the snapshots after dispose, this allows
     * this object to be reused when editor is disposed and created again
     * @param maxBufferSize The max buffer size for snapshots. Default value is 10MB
     */
    constructor(private preserveSnapshots?: boolean, private maxBufferSize: number = 1e7) {}

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;
        this.onDropDisposer = this.editor.addDomEventHandler('drop', this.onNativeEvent);
        this.onCutDisposer = this.editor.addDomEventHandler('cut', this.onNativeEvent);
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.onDropDisposer();
        this.onCutDisposer();
        this.onDropDisposer = null;
        this.onCutDisposer = null;
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
            case PluginEventType.EditorReady:
                this.addUndoSnapshot();
                break;
            case PluginEventType.KeyDown:
                this.onKeyDown(event.rawEvent);
                break;
            case PluginEventType.KeyPress:
                this.onKeyPress(event.rawEvent);
                break;
            case PluginEventType.CompositionEnd:
                this.clearRedoForInput();
                break;
            case PluginEventType.ContentChanged:
                this.onContentChanged(event);
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
    public addUndoSnapshot(): string {
        let snapshot = this.getSnapshot();
        this.getSnapshotsManager().addSnapshot(snapshot);
        this.hasNewContent = false;
        return snapshot;
    }

    protected getSnapshotsManager(): UndoSnapshotsService {
        if (!this.undoSnapshots) {
            this.undoSnapshots = new UndoSnapshots(this.maxBufferSize);
        }
        return this.undoSnapshots;
    }

    private restoreSnapshot(delta: number) {
        let snapshot = this.getSnapshotsManager().move(delta);

        if (snapshot != null) {
            try {
                this.isRestoring = true;
                this.editor.setContent(snapshot);
            } finally {
                this.isRestoring = false;
            }
        }
    }

    private onKeyDown(evt: KeyboardEvent): void {
        // Handle backspace/delete when there is a selection to take a snapshot
        // since we want the state prior to deletion restorable
        if (evt.which == KEY_BACKSPACE || evt.which == KEY_DELETE) {
            let selectionRange = this.editor.getSelectionRange();

            // Add snapshot when
            // 1. Something has been selected (not collapsed), or
            // 2. It has a different key code from the last keyDown event (to prevent adding too many snapshot when keeping press the same key), or
            // 3. Ctrl/Meta key is pressed so that a whole word will be deleted
            if (
                selectionRange &&
                (!selectionRange.collapsed ||
                    this.lastKeyPress != evt.which ||
                    evt.ctrlKey ||
                    evt.metaKey)
            ) {
                this.addUndoSnapshot();
            }

            // Since some content is deleted, always set hasNewContent to true so that we will take undo snapshot next time
            this.hasNewContent = true;
            this.lastKeyPress = evt.which;
        } else if (evt.which >= KEY_PAGEUP && evt.which <= KEY_DOWN) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            if (this.hasNewContent) {
                this.addUndoSnapshot();
            }
            this.lastKeyPress = 0;
        }
    }

    private onKeyPress(evt: KeyboardEvent): void {
        if (evt.metaKey) {
            // if metaKey is pressed, simply return since no actual effect will be taken on the editor.
            // this is to prevent changing hasNewContent to true when meta + v to paste on Safari.
            return;
        }

        let shouldTakeUndo = false;
        let selectionRange = this.editor.getSelectionRange();
        if (selectionRange && !selectionRange.collapsed) {
            // The selection will be removed, should take undo
            shouldTakeUndo = true;
        } else if (
            (evt.which == KEY_SPACE && this.lastKeyPress != KEY_SPACE) ||
            evt.which == KEY_ENTER
        ) {
            shouldTakeUndo = true;
        }

        if (shouldTakeUndo) {
            this.addUndoSnapshot();
            if (evt.which == KEY_ENTER) {
                // Treat ENTER as new content so if there is no input after ENTER and undo,
                // we restore the snapshot before ENTER
                this.hasNewContent = true;
            }
        } else {
            this.clearRedoForInput();
        }

        this.lastKeyPress = evt.which;
    }

    private onContentChanged(evt: ContentChangedEvent) {
        if (!this.isRestoring) {
            let currentSnapshot = this.getSnapshot();

            if (evt.lastSnapshot != currentSnapshot) {
                this.clearRedoForInput();
            }
        }
    }

    private getSnapshot() {
        return this.editor.getContent(false /*triggerExtractContentEvent*/, true /*markSelection*/);
    }

    private clearRedoForInput() {
        this.getSnapshotsManager().clearRedo();
        this.lastKeyPress = 0;
        this.hasNewContent = true;
    }

    private onNativeEvent = (e: UIEvent) => {
        this.editor.runAsync(() => {
            this.addUndoSnapshot();
            this.editor.triggerContentChangedEvent(
                e.type == 'cut' ? ChangeSource.Cut : ChangeSource.Drop
            );
        });
    };
}
