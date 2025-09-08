import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';

/**
 * A touch plugin to manage touch selection for roosterjs
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
    onPluginEvent(e: PluginEvent) {
        const editor = this.editor;

        console.log('test', event);
        if (!editor) {
            return;
        }
        if (
            e.eventType == 'pointerDown' &&
            (e.rawEvent.pointerType === 'touch' || e.rawEvent.pointerType === 'pen')
        ) {
            alert('Hello Rooster');
        }
    }
}
