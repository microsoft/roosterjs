import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export default class ImageResize implements EditorPlugin {
    private editor: IEditor;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ImageCrop';
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
        if (e.eventType == PluginEventType.StartCrop) {
            let text = e.test;
            this.editor.insertContent(text);
        }
    }
}
