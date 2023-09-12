import applyDefaultFormat from '../../publicApi/format/applyDefaultFormat';
import keyboardDelete from 'roosterjs-content-model-editor/lib/publicApi/editing/keyboardDelete';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { isCharacterValue } from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
    PluginKeyDownEvent,
} from 'roosterjs-editor-types';

// During IME input, KeyDown event will have "Process" as key
const ProcessKey = 'Process';

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

                case PluginEventType.ContentChanged:
                case PluginEventType.MouseUp:
                case PluginEventType.SelectionChanged:
                    this.editor.cacheContentModel(null);
                    break;
            }
        }
    }

    private handleKeyDownEvent(editor: IContentModelEditor, event: PluginKeyDownEvent) {
        const rawEvent = event.rawEvent;
        const which = rawEvent.which;

        if (rawEvent.defaultPrevented || event.handledByEditFeature) {
            // Other plugins already handled this event, so it is most likely content is already changed, we need to clear cached content model
            editor.cacheContentModel(null /*model*/);
        } else {
            // TODO: Consider use ContentEditFeature and need to hide other conflict features that are not based on Content Model
            switch (which) {
                case Keys.BACKSPACE:
                case Keys.DELETE:
                    if (!keyboardDelete(editor, rawEvent)) {
                        editor.cacheContentModel(null);
                    }

                    break;

                default:
                    if (isCharacterValue(rawEvent) || rawEvent.key == ProcessKey) {
                        applyDefaultFormat(editor);
                    }

                    editor.cacheContentModel(null);
                    break;
            }
        }
    }
}
