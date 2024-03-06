import type {
    ContentModelDocument,
    EditorPlugin,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * A plugin to help get HTML content from editor
 */
export class UpdateContentPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * Create a new instance of UpdateContentPlugin class
     * @param onUpdate A callback to be invoked when update happens
     */
    constructor(private onUpdate: (model: ContentModelDocument) => void) {}

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'UpdateContent';
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
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case 'beforeDispose':
                this.update();
                break;
        }
    }

    update() {
        if (this.editor) {
            const model = this.editor.getContentModelCopy('disconnected');
            this.onUpdate(model);
        }
    }
}
