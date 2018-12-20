import Editor from './Editor';
import { PluginEvent } from 'roosterjs-editor-types';

/**
 * Interface of an editor plugin
 */
interface EditorPlugin {
    /**
     * Name of a plugin. If null, editor will set its value with its class name
     */
    name?: string;

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize: (editor: Editor) => void;

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose: () => void;

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check:
     */
    willHandleEventExclusively?: (event: PluginEvent) => boolean;

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent?: (event: PluginEvent) => void;
}

export default EditorPlugin;
