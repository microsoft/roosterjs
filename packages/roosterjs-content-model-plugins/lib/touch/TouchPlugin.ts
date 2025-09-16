import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { repositionTouchSelection } from './repositionTouchSelection';

/**
 * Touch plugin to manage touch behaviors
 */
export class TouchPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * Create an instance of Touch plugin
     */
    constructor() {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Touch';
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
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }
        switch (event.eventType) {
            case 'pointerUp':
                repositionTouchSelection(this.editor);
                break;
        }
    }
}
