import addUndoSnapshot from '../undoApi/addUndoSnapshot';
import canRedo from '../undoApi/canRedo';
import canUndo from '../undoApi/canUndo';
import Editor from '../editor/Editor';
import isCtrlOrMetaPressed from '../eventApi/isCtrlOrMetaPressed';
import PluginWithState from '../interfaces/PluginWithState';
import UndoSnapshotsService from '../interfaces/UndoSnapshotsService';
import { PluginEvent, PluginEventType, Wrapper } from 'roosterjs-editor-types';

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_SPACE = 32;
const KEY_ENTER = 13;
const KEY_PAGEUP = 33;
const KEY_DOWN = 40;

/**
 * The state object for UndoPlugin
 */
export interface UndoPluginState {
    /**
     * Snapshot service for undo, it helps handle snapshot add, remove and retrive
     */
    snapshotsService: UndoSnapshotsService;

    /**
     * Whether restoring of undo snapshot is in proguress.
     */
    isRestoring: boolean;

    /**
     * Whether there is new content change after last undo snapshot is taken
     */
    hasNewContent: boolean;

    /**
     * A function to get current content from editor
     */
    getContent: () => string;

    /**
     * A function to set content to editor
     */
    setContent: (content: string) => void;
}

/**
 * Provides snapshot based undo service for Editor
 */
export default class UndoPlugin implements PluginWithState<UndoPluginState> {
    private editor: Editor;
    private lastKeyPress: number;

    /**
     * Construct a new instancoe of UndoPlugin
     * @param state The wrapper of the state object
     */
    constructor(public readonly state: Wrapper<UndoPluginState>) {}

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
    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.editor = null;
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
                if (!canUndo(this.state.value) && !canRedo(this.state.value)) {
                    // Only add initial snapshot when there is no existing snapshot
                    // Otherwise preserved undo/redo state may be ruined
                    addUndoSnapshot(this.state.value);
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
                addUndoSnapshot(this.state.value);
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
                addUndoSnapshot(this.state.value);
            }

            // Since some content is deleted, always set hasNewContent to true so that we will take undo snapshot next time
            this.state.value.hasNewContent = true;
            this.lastKeyPress = evt.which;
        } else if (evt.which >= KEY_PAGEUP && evt.which <= KEY_DOWN) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            if (this.state.value.hasNewContent) {
                addUndoSnapshot(this.state.value);
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
            addUndoSnapshot(this.state.value);
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
