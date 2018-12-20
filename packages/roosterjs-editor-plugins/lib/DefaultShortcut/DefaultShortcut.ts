import { Editor, EditorPlugin } from 'roosterjs-editor-core';

/**
 * @deprecated Use ContentEdit plugin with fature DefaultShortcut instead
 */
export default class DefaultShortcut implements EditorPlugin {
    public name: 'DefaultShortcut';

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor) {}

    /**
     * Dispose this plugin
     */
    public dispose() {}
}
