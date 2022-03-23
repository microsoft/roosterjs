import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

const TABLE_CELL_SELECTOR = 'td,th';

/**
 * TableAutoSumPlugin help highlight table cells
 */
export default class TableAutoSum implements EditorPlugin {
    private editor: IEditor;
    constructor() {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TableAutoSum';
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
        this.editor.select(null);
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor || event.eventType === PluginEventType.Input) {
            console.log(this.editor.getElementAtCursor(TABLE_CELL_SELECTOR));
        }
    }
}
