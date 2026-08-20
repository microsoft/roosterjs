import { setModelDirection } from 'roosterjs-content-model-api';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';

/**
 * Automatically updates the current block direction based on its first strong directional character.
 */
export class AutoDirectionPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'AutoDirection';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
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
     * Handle editor events
     * @param event The event to handle
     */
    onPluginEvent(event: PluginEvent) {
        if (
            this.editor &&
            (event.eventType === 'compositionEnd' ||
                (event.eventType === 'input' && event.rawEvent.inputType === 'insertText'))
        ) {
            this.editor.formatContentModel(model => setModelDirection(model, 'auto'), {
                apiName: 'autoDirection',
            });
        }
    }
}
