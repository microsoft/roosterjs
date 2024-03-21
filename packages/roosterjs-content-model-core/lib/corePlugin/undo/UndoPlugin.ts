import { ChangeSource, isCursorMovingKey } from 'roosterjs-content-model-dom';
import { createSnapshotsManager } from './SnapshotsManagerImpl';
import { undo } from '../../command/undo/undo';
import type {
    ContentChangedEvent,
    IEditor,
    PluginEvent,
    PluginWithState,
    EditorOptions,
    UndoPluginState,
} from 'roosterjs-content-model-types';

const Backspace = 'Backspace';
const Delete = 'Delete';
const Enter = 'Enter';

/**
 * Provides snapshot based undo service for Editor
 */
class UndoPlugin implements PluginWithState<UndoPluginState> {
    private editor: IEditor | null = null;
    private state: UndoPluginState;

    /**
     * Construct a new instance of UndoPlugin
     * @param options The wrapper of the state object
     */
    constructor(options: EditorOptions) {
        this.state = {
            snapshotsManager: createSnapshotsManager(options.snapshots),
            isRestoring: false,
            isNested: false,
            posContainer: null,
            posOffset: null,
            lastKeyPress: null,
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
            !!this.editor &&
            event.eventType == 'keyDown' &&
            event.rawEvent.key == Backspace &&
            !event.rawEvent.ctrlKey &&
            this.canUndoAutoComplete(this.editor)
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent): void {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'editorReady':
                const manager = this.state.snapshotsManager;
                const canUndo = manager.hasNewContent || manager.canMove(-1);
                const canRedo = manager.canMove(1);

                if (!canUndo && !canRedo) {
                    // Only add initial snapshot when there is no existing snapshot
                    // Otherwise preserved undo/redo state may be ruined
                    this.addUndoSnapshot();
                }
                break;
            case 'keyDown':
                this.onKeyDown(this.editor, event.rawEvent);
                break;
            case 'keyPress':
                this.onKeyPress(this.editor, event.rawEvent);
                break;
            case 'compositionEnd':
                this.clearRedoForInput();
                this.addUndoSnapshot();
                break;
            case 'contentChanged':
                this.onContentChanged(event);
                break;
            case 'beforeKeyboardEditing':
                this.onBeforeKeyboardEditing(event.rawEvent);
                break;
        }
    }

    private onKeyDown(editor: IEditor, evt: KeyboardEvent): void {
        const { snapshotsManager } = this.state;

        // Handle backspace/delete when there is a selection to take a snapshot
        // since we want the state prior to deletion restorable
        // Ignore if keycombo is ALT+BACKSPACE
        if ((evt.key == Backspace && !evt.altKey) || evt.key == Delete) {
            if (evt.key == Backspace && !evt.ctrlKey && this.canUndoAutoComplete(editor)) {
                evt.preventDefault();
                undo(editor);
                this.state.posContainer = null;
                this.state.posOffset = null;
                this.state.lastKeyPress = evt.key;
            } else if (!evt.defaultPrevented) {
                const selection = editor.getDOMSelection();

                // Add snapshot when
                // 1. Something has been selected (not collapsed), or
                // 2. It has a different key code from the last keyDown event (to prevent adding too many snapshot when keeping press the same key), or
                // 3. Ctrl/Meta key is pressed so that a whole word will be deleted
                if (
                    selection &&
                    (selection.type != 'range' ||
                        !selection.range.collapsed ||
                        this.state.lastKeyPress != evt.key ||
                        this.isCtrlOrMetaPressed(editor, evt))
                ) {
                    this.addUndoSnapshot();
                }

                // Since some content is deleted, always set hasNewContent to true so that we will take undo snapshot next time
                snapshotsManager.hasNewContent = true;
                this.state.lastKeyPress = evt.key;
            }
        } else if (isCursorMovingKey(evt)) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            if (snapshotsManager.hasNewContent) {
                this.addUndoSnapshot();
            }
            this.state.lastKeyPress = null;
        } else if (this.state.lastKeyPress == Backspace || this.state.lastKeyPress == Delete) {
            if (snapshotsManager.hasNewContent) {
                this.addUndoSnapshot();
            }
        }
    }

    private onKeyPress(editor: IEditor, evt: KeyboardEvent): void {
        if (evt.metaKey) {
            // if metaKey is pressed, simply return since no actual effect will be taken on the editor.
            // this is to prevent changing hasNewContent to true when meta + v to paste on Safari.
            return;
        }

        const selection = editor.getDOMSelection();

        if (
            (selection && (selection.type != 'range' || !selection.range.collapsed)) ||
            (evt.key == ' ' && this.state.lastKeyPress != ' ') ||
            evt.key == Enter
        ) {
            this.addUndoSnapshot();

            if (evt.key == Enter) {
                // Treat ENTER as new content so if there is no input after ENTER and undo,
                // we restore the snapshot before ENTER
                this.state.snapshotsManager.hasNewContent = true;
            }
        } else {
            this.clearRedoForInput();
        }

        this.state.lastKeyPress = evt.key;
    }

    private onBeforeKeyboardEditing(event: KeyboardEvent) {
        // For keyboard event (triggered from Content Model), we can get its keycode from event.data
        // And when user is keep pressing the same key, mark editor with "hasNewContent" so that next time user
        // do some other action or press a different key, we will add undo snapshot
        if (event.key != this.state.lastKeyPress) {
            this.addUndoSnapshot();
        }

        this.state.lastKeyPress = event.key;
        this.state.snapshotsManager.hasNewContent = true;
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
        this.state.snapshotsManager.clearRedo();
        this.state.lastKeyPress = null;
        this.state.snapshotsManager.hasNewContent = true;
    }

    private canUndoAutoComplete(editor: IEditor) {
        const selection = editor.getDOMSelection();

        return (
            this.state.snapshotsManager.canUndoAutoComplete() &&
            selection?.type == 'range' &&
            selection.range.collapsed &&
            selection.range.startContainer == this.state.posContainer &&
            selection.range.startOffset == this.state.posOffset
        );
    }

    private addUndoSnapshot() {
        this.editor?.takeSnapshot();
        this.state.posContainer = null;
        this.state.posOffset = null;
    }

    private isCtrlOrMetaPressed(editor: IEditor, event: KeyboardEvent) {
        const env = editor.getEnvironment();

        return env.isMac ? event.metaKey : event.ctrlKey;
    }
}

/**
 * @internal
 * Create a new instance of UndoPlugin.
 * @param option The editor option
 */
export function createUndoPlugin(option: EditorOptions): PluginWithState<UndoPluginState> {
    return new UndoPlugin(option);
}
