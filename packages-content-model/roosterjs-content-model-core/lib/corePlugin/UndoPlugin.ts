import { ChangeSource } from '../constants/ChangeSource';
import { createUndoSnapshotsService } from '../editor/UndoSnapshotServiceImpl';
import { isCursorMovingKey } from '../publicApi/domUtils/eventUtils';
import { PluginEventType } from 'roosterjs-editor-types';
import type {
    IStandaloneEditor,
    StandaloneEditorOptions,
    UndoPluginState,
} from 'roosterjs-content-model-types';
import type {
    ContentChangedEvent,
    IEditor,
    PluginEvent,
    PluginWithState,
} from 'roosterjs-editor-types';

const Backspace = 'Backspace';
const Delete = 'Delete';
const Enter = 'Enter';

/**
 * Provides snapshot based undo service for Editor
 */
class UndoPlugin implements PluginWithState<UndoPluginState> {
    private editor: (IStandaloneEditor & IEditor) | null = null;
    private lastKeyPress: string | null = 'null';
    private state: UndoPluginState;

    /**
     * Construct a new instance of UndoPlugin
     * @param options The wrapper of the state object
     */
    constructor(options: StandaloneEditorOptions) {
        this.state = {
            snapshotsService: options.undoSnapshotService || createUndoSnapshotsService(),
            isRestoring: false,
            hasNewContent: false,
            isNested: false,
            posContainer: null,
            posOffset: null,
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
        this.editor = editor as IEditor & IStandaloneEditor;
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
            event.eventType == PluginEventType.KeyDown &&
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
                this.onKeyDown(this.editor, event.rawEvent);
                break;
            case PluginEventType.KeyPress:
                this.onKeyPress(this.editor, event.rawEvent);
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

    private onKeyDown(editor: IStandaloneEditor, evt: KeyboardEvent): void {
        // Handle backspace/delete when there is a selection to take a snapshot
        // since we want the state prior to deletion restorable
        // Ignore if keycombo is ALT+BACKSPACE
        if ((evt.key == Backspace && !evt.altKey) || evt.key == Delete) {
            if (evt.key == Backspace && !evt.ctrlKey && this.canUndoAutoComplete(editor)) {
                evt.preventDefault();
                editor.undo();
                this.state.posContainer = null;
                this.state.posOffset = null;
                this.lastKeyPress = evt.key;
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
                        this.lastKeyPress != evt.key ||
                        this.isCtrlOrMetaPressed(editor, evt))
                ) {
                    this.addUndoSnapshot();
                }

                // Since some content is deleted, always set hasNewContent to true so that we will take undo snapshot next time
                this.state.hasNewContent = true;
                this.lastKeyPress = evt.key;
            }
        } else if (isCursorMovingKey(evt)) {
            // PageUp, PageDown, Home, End, Left, Right, Up, Down
            if (this.state.hasNewContent) {
                this.addUndoSnapshot();
            }
            this.lastKeyPress = null;
        } else if (this.lastKeyPress == Backspace || this.lastKeyPress == Delete) {
            if (this.state.hasNewContent) {
                this.addUndoSnapshot();
            }
        }
    }

    private onKeyPress(editor: IStandaloneEditor, evt: KeyboardEvent): void {
        if (evt.metaKey) {
            // if metaKey is pressed, simply return since no actual effect will be taken on the editor.
            // this is to prevent changing hasNewContent to true when meta + v to paste on Safari.
            return;
        }

        const selection = editor.getDOMSelection();

        if (
            (selection && (selection.type != 'range' || !selection.range.collapsed)) ||
            (evt.key == ' ' && this.lastKeyPress != ' ') ||
            evt.key == Enter
        ) {
            this.addUndoSnapshot();

            if (evt.key == Enter) {
                // Treat ENTER as new content so if there is no input after ENTER and undo,
                // we restore the snapshot before ENTER
                this.state.hasNewContent = true;
            }
        } else {
            this.clearRedoForInput();
        }

        this.lastKeyPress = evt.key;
    }

    private onBeforeKeyboardEditing(event: KeyboardEvent) {
        // For keyboard event (triggered from Content Model), we can get its keycode from event.data
        // And when user is keep pressing the same key, mark editor with "hasNewContent" so that next time user
        // do some other action or press a different key, we will add undo snapshot
        if (event.key != this.lastKeyPress) {
            this.addUndoSnapshot();
        }

        this.lastKeyPress = event.key;
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
        this.lastKeyPress = null;
        this.state.hasNewContent = true;
    }

    private canUndoAutoComplete(editor: IStandaloneEditor) {
        const selection = editor.getDOMSelection();

        return (
            this.state.snapshotsService.canUndoAutoComplete() &&
            selection?.type == 'range' &&
            selection.range.collapsed &&
            selection.range.startContainer == this.state.posContainer &&
            selection.range.startOffset == this.state.posOffset
        );
    }

    private addUndoSnapshot() {
        this.editor?.addUndoSnapshot();
        this.state.posContainer = null;
        this.state.posOffset = null;
    }

    private isCtrlOrMetaPressed(editor: IStandaloneEditor, event: KeyboardEvent) {
        const env = editor.getEnvironment();

        return env.isMac ? event.metaKey : event.ctrlKey;
    }
}

/**
 * @internal
 * Create a new instance of UndoPlugin.
 * @param option The editor option
 */
export function createUndoPlugin(
    option: StandaloneEditorOptions
): PluginWithState<UndoPluginState> {
    return new UndoPlugin(option);
}
