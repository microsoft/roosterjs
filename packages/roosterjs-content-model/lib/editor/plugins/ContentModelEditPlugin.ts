import handleKeyDownEvent from '../../publicApi/editing/handleKeyDownEvent';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    EditorPlugin,
    EntityOperationEvent,
    ExperimentalFeatures,
    IEditor,
    Keys,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * ContentModel plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Delete Key
 * 2. Backspace Key
 */
export default class ContentModelEditPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;
    private triggeredEntityEvents: EntityOperationEvent[] = [];
    private editWithContentModel = false;

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
        this.editWithContentModel = this.editor.isFeatureEnabled(
            ExperimentalFeatures.EditWithContentModel
        );
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
            if (
                event.eventType == PluginEventType.EntityOperation &&
                event.rawEvent?.type == 'keydown'
            ) {
                // If we see an entity operation event triggered from keydown event, it means the event can be triggered from original
                // EntityFeatures or EntityPlugin, so we don't need to trigger the same event again from ContentModel.
                // TODO: This is a temporary solution. Once Content Model can fully replace Entity Features, we can remove this.
                this.triggeredEntityEvents.push(event);
            } else if (event.eventType == PluginEventType.KeyDown) {
                if (!this.editWithContentModel || event.rawEvent.defaultPrevented) {
                    // Other plugins already handled this event, so it is most likely content is already changed, we need to clear cached content model
                    this.editor.cacheContentModel(null /*model*/);
                } else if (!event.rawEvent.defaultPrevented) {
                    // TODO: Consider use ContentEditFeature and need to hide other conflict features that are not based on Content Model
                    switch (event.rawEvent.which) {
                        case Keys.BACKSPACE:
                        case Keys.DELETE:
                            handleKeyDownEvent(
                                this.editor,
                                event.rawEvent,
                                this.triggeredEntityEvents
                            );
                            break;

                        default:
                            this.editor.cacheContentModel(null);
                            break;
                    }
                }

                if (this.triggeredEntityEvents.length > 0) {
                    this.triggeredEntityEvents = [];
                }
            } else if (
                event.eventType == PluginEventType.ContentChanged ||
                event.eventType == PluginEventType.MouseUp
            ) {
                this.editor.cacheContentModel(null);
            }
        }
    }
}
