import createWrapper from '../utils/createWrapper';
import Editor from '../../editor/Editor';
import PluginWithState from '../../interfaces/PluginWithState';
import { Keys } from '../../interfaces/ContentEditFeature';
import { PluginEvent, PluginEventType, Wrapper } from 'roosterjs-editor-types';

/**
 * Auto complete Component helps handle the undo operation for an auto complete action
 */
export default class AutoCompletePlugin implements PluginWithState<string> {
    private editor: Editor;
    private state: Wrapper<string> = createWrapper(null);

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'AutoComplete';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: Editor) {
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
            !!this.state.value
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.ContentChanged:
            case PluginEventType.MouseDown:
                this.state.value = null;
                break;
            case PluginEventType.KeyDown:
                if (event.rawEvent.which != Keys.BACKSPACE) {
                    this.state.value = null;
                } else if (this.state.value !== null) {
                    event.rawEvent.preventDefault();
                    this.editor.setContent(this.state.value);
                }
                break;
        }
    }
}
