import {
    EditorOptions,
    IEditor,
    LiteralKeys,
    PluginEvent,
    PluginEventType,
    PluginWithState,
    UndoPluginState,
    UndoSnapshotsService,
} from 'roosterjs-editor-types';
import {
    addSnapshot,
    canMoveCurrentSnapshot,
    clearProceedingSnapshots,
    createSnapshots,
    isCtrlOrMetaPressed,
    moveCurrentSnapshot,
    canUndoAutoComplete,
} from 'roosterjs-editor-dom';

// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAX_SIZE_LIMIT = 1e7;

/**
 * @internal
 * Provides snapshot based undo service for Editor
 */
export default class UndoPlugin implements PluginWithState<UndoPluginState> {
    private editor: IEditor;
    private lastKeyPress: string;
    private state: UndoPluginState;

    /**
     * Construct a new instance of UndoPlugin
     * @param options The wrapper of the state object
     */
    constructor(options: EditorOptions) {
        this.state = {
            snapshotsService: options.undoSnapshotService || createUndoSnapshots(),
            isRestoring: false,
            hasNewContent: false,
            isNested: false,
            autoCompletePosition: null,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Undo';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor): void {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * @param event The event to check
     */
    willHandleEventExclusively(event: PluginEvent) {
        return (
            event.eventType == PluginEventType.KeyDown &&
            event.rawEvent.key == LiteralKeys.BACKSPACE &&
            this.canUndoAutoComplete()
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent): void {
        // if editor is in IME, don't do anything
        if (!this.editor || this.editor.isInIME()) {
            return;
        }

        switch (event.eventType) {
            case PluginEventType.EditorReady:
                const undoState = this.editor.getUndoState();
                if (!undoState.canUndo && !undoState.canRedo) {
                    // Only add initial snapshot when there is no existing snapshot
                    // Otherwise preserved undo/redo state may be ruined
                    this.addUndoSnapshot();
                }
                break;
            case PluginEventType.KeyDown:
                this.onKeyDown(event.rawEvent);
                break;
            case PluginEventType.KeyPress:
                this.onKeyPress(event.rawEvent);
                break;
            case PluginEventType.CompositionEnd:
                this.clearRedoForInput();
                this.addUndoSnapshot();
                break;
            case PluginEventType.ContentChanged:
                if (!this.state.isRestoring) {
                    this.clearRedoForInput();
                }
                break;
        }
    }

    private onKeyDown(evt: KeyboardEvent): void {
        // Handle backspace/delete when there is a selection to take a snapshot
        // since we want the state prior to deletion restorable
        if (evt.key == LiteralKeys.BACKSPACE || evt.key == LiteralKeys.DELETE) {
            if (evt.key == LiteralKeys.BACKSPACE && this.canUndoAutoComplete()) {
                evt.preventDefault();
                this.editor.undo();
                this.state.autoCompletePosition = null;
                this.lastKeyPress = evt.key;
            } else {
                let selectionRange = this.editor.getSelectionRange();

                // Add snapshot when
                // 1. Something has been selected (not collapsed), or
                // 2. It has a different key code from the last keyDown event (to prevent adding too many snapshot when keeping press the same key), or
                // 3. Ctrl/Meta key is pressed so that a whole word will be deleted
                if (
                    selectionRange &&
                    (!selectionRange.collapsed ||
                        this.lastKeyPress != evt.key ||
                        isCtrlOrMetaPressed(evt))
                ) {
                    this.addUndoSnapshot();
                }

                // Since some content is deleted, always set hasNewContent to true so that we will take undo snapshot next time
                this.state.hasNewContent = true;
                this.lastKeyPress = evt.key;
            }
        } else if (evt.key >= LiteralKeys.PAGEUP && evt.key <= LiteralKeys.DOWN) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            if (this.state.hasNewContent) {
                this.addUndoSnapshot();
            }
            this.lastKeyPress = LiteralKeys.NULL;
        }
    }

    private onKeyPress(evt: KeyboardEvent): void {
        if (evt.metaKey) {
            // if metaKey is pressed, simply return since no actual effect will be taken on the editor.
            // this is to prevent changing hasNewContent to true when meta + v to paste on Safari.
            return;
        }

        let range = this.editor.getSelectionRange();
        if (
            (range && !range.collapsed) ||
            (evt.key == LiteralKeys.SPACE && this.lastKeyPress != LiteralKeys.SPACE) ||
            evt.key == LiteralKeys.ENTER
        ) {
            this.addUndoSnapshot();
            if (evt.key == LiteralKeys.ENTER) {
                // Treat ENTER as new content so if there is no input after ENTER and undo,
                // we restore the snapshot before ENTER
                this.state.hasNewContent = true;
            }
        } else {
            this.clearRedoForInput();
        }

        this.lastKeyPress = evt.key;
    }

    private clearRedoForInput() {
        this.state.snapshotsService.clearRedo();
        this.lastKeyPress = LiteralKeys.NULL;
        this.state.hasNewContent = true;
    }

    private canUndoAutoComplete() {
        return (
            this.state.snapshotsService.canUndoAutoComplete() &&
            this.state.autoCompletePosition?.equalTo(this.editor.getFocusedPosition())
        );
    }

    private addUndoSnapshot() {
        this.editor.addUndoSnapshot();
        this.state.autoCompletePosition = null;
    }
}

function createUndoSnapshots(): UndoSnapshotsService {
    const snapshots = createSnapshots(MAX_SIZE_LIMIT);

    return {
        canMove: (delta: number): boolean => canMoveCurrentSnapshot(snapshots, delta),
        move: (delta: number): string => moveCurrentSnapshot(snapshots, delta),
        addSnapshot: (snapshot: string, isAutoCompleteSnapshot: boolean) =>
            addSnapshot(snapshots, snapshot, isAutoCompleteSnapshot),
        clearRedo: () => clearProceedingSnapshots(snapshots),
        canUndoAutoComplete: () => canUndoAutoComplete(snapshots),
    };
}
