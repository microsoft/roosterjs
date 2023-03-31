import handleBackspaceKey from '../../publicApi/editing/handleBackspaceKey';
import handleDeleteKey from '../../publicApi/editing/handleDeleteKey';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { EditorPlugin, IEditor, Keys, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * ContentModel plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Delete Key
 * 2. Backspace Key
 */
export default class ContentModelEditPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelEdit';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        // TODO: Later we may need a different interface for Content Model editor plugin
        this.editor = editor as IContentModelEditor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check:
     */
    willHandleEventExclusively(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.KeyDown &&
            (event.rawEvent.which == Keys.DELETE || event.rawEvent.which == Keys.BACKSPACE)
        ) {
            // TODO: Consider use ContentEditFeature and need to hide other conflict features that are not based on Content Model
            return true;
        }

        return false;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor && event.eventType == PluginEventType.KeyDown) {
            // TODO: Consider use ContentEditFeature and need to hide other conflict features that are not based on Content Model
            switch (event.rawEvent.which) {
                case Keys.BACKSPACE:
                    handleBackspaceKey(this.editor, event.rawEvent);
                    break;

                case Keys.DELETE:
                    handleDeleteKey(this.editor, event.rawEvent);
                    break;
            }
        }
    }
}
