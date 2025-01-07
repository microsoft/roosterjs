import type { PluginEvent, IEditor } from 'roosterjs-content-model-types';
import type { EditorPlugin } from 'roosterjs-editor-types';

/**
 * Represents a mixed version plugin that can handle both v8 and v9 events.
 * This is not commonly used, but just for transitioning from v8 to v9 plugins
 */
export interface MixedPlugin extends EditorPlugin {
    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */

    initializeV9: (editor: IEditor) => void;

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check:
     */
    willHandleEventExclusivelyV9?: (event: PluginEvent) => boolean;

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEventV9?: (event: PluginEvent) => void;
}
