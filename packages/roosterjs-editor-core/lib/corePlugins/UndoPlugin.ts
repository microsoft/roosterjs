import {
    ChangeSource,
    ContentChangedEvent,
    EditorOptions,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginWithState,
    Snapshot,
    UndoPluginState,
    UndoSnapshotsService,
} from 'roosterjs-editor-types';
import {
    addSnapshotV2,
    canMoveCurrentSnapshot,
    clearProceedingSnapshotsV2,
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
    private editor: IEditor | null = null;
    private lastKeyPress: number | null = null;
    private state: UndoPluginState;

    /**
     * Construct a new instance of UndoPlugin
     * @param options The wrapper of the state object
     */
    constructor(options: EditorOptions) {
        this.state = {
            snapshotsService:
                options.undoMetadataSnapshotService ||
                createUndoSnapshotServiceBridge(options.undoSnapshotService) ||
                createUndoSnapshots(),
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
            event.rawEvent.which == Keys.BACKSPACE &&
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
                this.onContentChanged(event);
                break;
            case PluginEventType.BeforeKeyboardEditing:
                this.onBeforeKeyboardEditing(event.rawEvent);
                break;
        }
    }

    private onKeyDown(evt: KeyboardEvent): void {
        // Handle backspace/delete when there is a selection to take a snapshot
        // since we want the state prior to deletion restorable
        // Ignore if keycombo is ALT+BACKSPACE
        if ((evt.which == Keys.BACKSPACE && !evt.altKey) || evt.which == Keys.DELETE) {
            if (evt.which == Keys.BACKSPACE && this.canUndoAutoComplete()) {
                evt.preventDefault();
                this.editor?.undo();
                this.state.autoCompletePosition = null;
                this.lastKeyPress = evt.which;
            } else if (!evt.defaultPrevented) {
                let selectionRange = this.editor?.getSelectionRange();

                // Add snapshot when
                // 1. Something has been selected (not collapsed), or
                // 2. It has a different key code from the last keyDown event (to prevent adding too many snapshot when keeping press the same key), or
                // 3. Ctrl/Meta key is pressed so that a whole word will be deleted
                if (
                    selectionRange &&
                    (!selectionRange.collapsed ||
                        this.lastKeyPress != evt.which ||
                        isCtrlOrMetaPressed(evt))
                ) {
                    this.addUndoSnapshot();
                }

                // Since some content is deleted, always set hasNewContent to true so that we will take undo snapshot next time
                this.state.hasNewContent = true;
                this.lastKeyPress = evt.which;
            }
        } else if (evt.which >= Keys.PAGEUP && evt.which <= Keys.DOWN) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            if (this.state.hasNewContent) {
                this.addUndoSnapshot();
            }
            this.lastKeyPress = 0;
        } else if (this.lastKeyPress == Keys.BACKSPACE || this.lastKeyPress == Keys.DELETE) {
            if (this.state.hasNewContent) {
                this.addUndoSnapshot();
            }
        }
    }

    private onKeyPress(evt: KeyboardEvent): void {
        if (evt.metaKey) {
            // if metaKey is pressed, simply return since no actual effect will be taken on the editor.
            // this is to prevent changing hasNewContent to true when meta + v to paste on Safari.
            return;
        }

        let range = this.editor?.getSelectionRange();
        if (
            (range && !range.collapsed) ||
            (evt.which == Keys.SPACE && this.lastKeyPress != Keys.SPACE) ||
            evt.which == Keys.ENTER
        ) {
            this.addUndoSnapshot();
            if (evt.which == Keys.ENTER) {
                // Treat ENTER as new content so if there is no input after ENTER and undo,
                // we restore the snapshot before ENTER
                this.state.hasNewContent = true;
            }
        } else {
            this.clearRedoForInput();
        }

        this.lastKeyPress = evt.which;
    }

    private onBeforeKeyboardEditing(event: KeyboardEvent) {
        // For keyboard event (triggered from Content Model), we can get its keycode from event.data
        // And when user is keep pressing the same key, mark editor with "hasNewContent" so that next time user
        // do some other action or press a different key, we will add undo snapshot
        if (event.which != this.lastKeyPress) {
            this.addUndoSnapshot();
        }

        this.lastKeyPress = event.which;
        this.state.hasNewContent = true;
    }

    private onContentChanged(event: ContentChangedEvent) {
        if (
            !(
                this.state.isRestoring ||
                event.source == ChangeSource.SwitchToDarkMode ||
                event.source == ChangeSource.SwitchToLightMode ||
                event.source == ChangeSource.Keyboard
            )
        ) {
            this.clearRedoForInput();
        }
    }

    private clearRedoForInput() {
        this.state.snapshotsService.clearRedo();
        this.lastKeyPress = 0;
        this.state.hasNewContent = true;
    }

    private canUndoAutoComplete() {
        const focusedPosition = this.editor?.getFocusedPosition();
        return (
            this.state.snapshotsService.canUndoAutoComplete() &&
            !!focusedPosition &&
            !!this.state.autoCompletePosition?.equalTo(focusedPosition)
        );
    }

    private addUndoSnapshot() {
        this.editor?.addUndoSnapshot();
        this.state.autoCompletePosition = null;
    }
}

function createUndoSnapshots(): UndoSnapshotsService<Snapshot> {
    const snapshots = createSnapshots<Snapshot>(MAX_SIZE_LIMIT);

    return {
        canMove: (delta: number): boolean => canMoveCurrentSnapshot(snapshots, delta),
        move: (delta: number): Snapshot | null => moveCurrentSnapshot(snapshots, delta),
        addSnapshot: (snapshot: Snapshot, isAutoCompleteSnapshot: boolean) =>
            addSnapshotV2(snapshots, snapshot, isAutoCompleteSnapshot),
        clearRedo: () => clearProceedingSnapshotsV2(snapshots),
        canUndoAutoComplete: () => canUndoAutoComplete(snapshots),
    };
}

function createUndoSnapshotServiceBridge(
    service: UndoSnapshotsService<string> | undefined
): UndoSnapshotsService<Snapshot> | undefined {
    let html: string | null;
    return service
        ? {
              canMove: (delta: number) => service.canMove(delta),
              move: (delta: number): Snapshot | null =>
                  (html = service.move(delta)) ? { html, metadata: null, knownColors: [] } : null,
              addSnapshot: (snapshot: Snapshot, isAutoCompleteSnapshot: boolean) =>
                  service.addSnapshot(
                      snapshot.html +
                          (snapshot.metadata ? `<!--${JSON.stringify(snapshot.metadata)}-->` : ''),
                      isAutoCompleteSnapshot
                  ),
              clearRedo: () => service.clearRedo(),
              canUndoAutoComplete: () => service.canUndoAutoComplete(),
          }
        : undefined;
}
