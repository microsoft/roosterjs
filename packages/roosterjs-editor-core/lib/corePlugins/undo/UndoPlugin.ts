import createWrapper from '../utils/createWrapper';
import isCtrlOrMetaPressed from '../../eventApi/isCtrlOrMetaPressed';
import {
    EditorOptions,
    IEditor,
    PluginEvent,
    PluginEventType,
    PluginWithState,
    UndoPluginState,
    UndoSnapshotsService,
    Wrapper,
} from 'roosterjs-editor-types';
import {
    addSnapshot,
    canMoveCurrentSnapshot,
    moveCurrentSnapsnot,
    clearProceedingSnapshots,
    createSnapshots,
} from 'roosterjs-editor-dom';

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_SPACE = 32;
const KEY_ENTER = 13;
const KEY_PAGEUP = 33;
const KEY_DOWN = 40;

// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAXSIZELIMIT = 1e7;

/**
 * Provides snapshot based undo service for Editor
 */
export default class UndoPlugin implements PluginWithState<UndoPluginState> {
    private editor: IEditor;
    private lastKeyPress: number;
    private state: Wrapper<UndoPluginState>;

    /**
     * Construct a new instance of UndoPlugin
     * @param options The wrapper of the state object
     */
    constructor(options: EditorOptions) {
        this.state = createWrapper({
            snapshotsService: options.undoSnapshotService || createUndoSnapshots(),
            isRestoring: false,
            hasNewContent: false,
            outerUndoSnapshot: null,
        });
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
                if (!this.editor.canUndo() && !this.editor.canRedo()) {
                    // Only add initial snapshot when there is no existing snapshot
                    // Otherwise preserved undo/redo state may be ruined
                    this.editor.addUndoSnapshot();
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
                this.editor.addUndoSnapshot();
                break;
            case PluginEventType.ContentChanged:
                if (!this.state.value.isRestoring) {
                    this.clearRedoForInput();
                }
                break;
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
                    isCtrlOrMetaPressed(evt))
            ) {
                this.editor.addUndoSnapshot();
            }

            // Since some content is deleted, always set hasNewContent to true so that we will take undo snapshot next time
            this.state.value.hasNewContent = true;
            this.lastKeyPress = evt.which;
        } else if (evt.which >= KEY_PAGEUP && evt.which <= KEY_DOWN) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            if (this.state.value.hasNewContent) {
                this.editor.addUndoSnapshot();
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

        let range = this.editor.getSelectionRange();
        if (
            (range && !range.collapsed) ||
            (evt.which == KEY_SPACE && this.lastKeyPress != KEY_SPACE) ||
            evt.which == KEY_ENTER
        ) {
            this.editor.addUndoSnapshot();
            if (evt.which == KEY_ENTER) {
                // Treat ENTER as new content so if there is no input after ENTER and undo,
                // we restore the snapshot before ENTER
                this.state.value.hasNewContent = true;
            }
        } else {
            this.clearRedoForInput();
        }

        this.lastKeyPress = evt.which;
    }

    private clearRedoForInput() {
        this.state.value.snapshotsService.clearRedo();
        this.lastKeyPress = 0;
        this.state.value.hasNewContent = true;
    }
}

function createUndoSnapshots(): UndoSnapshotsService {
    const snapshots = createSnapshots(MAXSIZELIMIT);

    return {
        canMove: (delta: number): boolean => canMoveCurrentSnapshot(snapshots, delta),
        move: (delta: number): string => moveCurrentSnapsnot(snapshots, delta),
        addSnapshot: (snapshot: string) => addSnapshot(snapshots, snapshot),
        clearRedo: () => clearProceedingSnapshots(snapshots),
    };
}
