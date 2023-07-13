import { EditorPlugin } from 'roosterjs-editor-types';

/**
 * Dummy plugin, just to skip original TypeInContainerPlugin's behavior
 */
export default class ContentModelTypeInContainerPlugin implements EditorPlugin {
    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelTypeInContainer';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize() {}

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {}
}
