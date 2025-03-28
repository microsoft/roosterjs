import { ChangeSource } from 'roosterjs-content-model-dom';
import { fixupHiddenProperties } from './fixupHiddenProperties';
import type { IEditor, PluginEvent, EditorPlugin } from 'roosterjs-content-model-types';
import type { HiddenPropertyOptions } from './HiddenPropertyOptions';

/**
 * HiddenPropertyPlugin helps editor to maintain hidden properties in DOM after editor content is reset using HTML
 * This includes:
 * TODO: ADD more hidden properties here
 */
export class HiddenPropertyPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * Construct a new instance of FormatPlugin class
     * @param option The editor option
     */
    constructor(private option: HiddenPropertyOptions) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'HiddenProperty';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
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
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        if (event.eventType == 'contentChanged' && event.source == ChangeSource.SetContent) {
            fixupHiddenProperties(this.editor, this.option);
        }
    }
}
