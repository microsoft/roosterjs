import keyboardDelete from '../../publicApi/editing/keyboardDelete';
import { ContentModelEditorPlugin } from 'roosterjs-content-model-editor/lib/publicTypes/ContentModelEditorPlugin';
import { ContentModelPluginEvent } from 'roosterjs-content-model-editor/lib/publicTypes/event/ContentModelPluginEvent';
import { ContentModelPluginKeyDownEvent } from 'roosterjs-content-model-editor/lib/publicTypes/event/ContentModelPluginDomEvent';
import { Keys } from 'roosterjs-editor-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * ContentModel plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Delete Key
 * 2. Backspace Key
 */
export default class ContentModelEditPlugin implements ContentModelEditorPlugin {
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
    initialize(editor: IContentModelEditor) {
        this.editor = editor;
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
    onPluginEvent(event: ContentModelPluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case 'keyDown':
                    this.handleKeyDownEvent(this.editor, event);
                    break;
            }
        }
    }

    private handleKeyDownEvent(editor: IContentModelEditor, event: ContentModelPluginKeyDownEvent) {
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
