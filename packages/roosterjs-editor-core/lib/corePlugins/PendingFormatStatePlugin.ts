import { Position } from 'roosterjs-editor-dom';
import {
    IEditor,
    PendingFormatStatePluginState,
    PluginEvent,
    PluginEventType,
    PluginWithState,
} from 'roosterjs-editor-types';

/**
 * @internal
 * PendingFormatStatePlugin handles pending format state management
 */
export default class PendingFormatStatePlugin
    implements PluginWithState<PendingFormatStatePluginState> {
    private editor: IEditor;
    private state: PendingFormatStatePluginState;

    /**
     * Construct a new instance of PendingFormatStatePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor() {
        this.state = {
            pendableFormatPosition: null,
            pendableFormatState: null,
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'PendingFormatState';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.clear();
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
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.PendingFormatStateChanged:
                // Got PendingFormatStateChanged event, cache current position and pending format
                this.state.pendableFormatPosition = this.getCurrentPosition();
                this.state.pendableFormatState = event.formatState;
                break;
            case PluginEventType.KeyDown:
            case PluginEventType.MouseDown:
            case PluginEventType.ContentChanged:
                // If content or position is changed (by keyboard, mouse, or code),
                // check if current position is still the same with the cached one (if exist),
                // and clear cached format if position is changed since it is out-of-date now
                if (
                    this.state.pendableFormatPosition &&
                    !this.state.pendableFormatPosition.equalTo(this.getCurrentPosition())
                ) {
                    this.clear();
                }
                break;
        }
    }

    private clear() {
        this.state.pendableFormatPosition = null;
        this.state.pendableFormatState = null;
    }

    private getCurrentPosition() {
        let range = this.editor.getSelectionRange();
        return range && Position.getStart(range).normalize();
    }
}
