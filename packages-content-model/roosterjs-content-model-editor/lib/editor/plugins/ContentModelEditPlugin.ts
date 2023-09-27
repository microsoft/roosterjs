import keyboardDelete from '../../publicApi/editing/keyboardDelete';
import { Keys, PluginEventType } from 'roosterjs-editor-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import type {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginKeyDownEvent,
} from 'roosterjs-editor-types';

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
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.KeyDown:
                    this.handleKeyDownEvent(this.editor, event);
                    break;
            }
        }
    }

    private handleKeyDownEvent(editor: IContentModelEditor, event: PluginKeyDownEvent) {
        const rawEvent = event.rawEvent;
        const which = rawEvent.which;

        if (!rawEvent.defaultPrevented && !event.handledByEditFeature) {
            // TODO: Consider use ContentEditFeature and need to hide other conflict features that are not based on Content Model
            switch (which) {
                case Keys.BACKSPACE:
                case Keys.DELETE:
                    // Use our API to handle BACKSPACE/DELETE key.
                    // No need to clear cache here since if we rely on browser's behavior, there will be Input event and its handler will reconcile cache
                    keyboardDelete(editor, rawEvent);
                    break;
            }
        }
    }
}

/**
 * @internal
 * Create a new instance of ContentModelEditPlugin class.
 * This is mostly for unit test
 */
export function createContentModelEditPlugin() {
    return new ContentModelEditPlugin();
}
