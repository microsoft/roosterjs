import keyboardListTrigger from './keyboardListTrigger';
import type {
    EditorPlugin,
    IStandaloneEditor,
    KeyDownEvent,
    PluginEvent,
} from 'roosterjs-content-model-types';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

interface AutoFormatOptions {
    autoBullet: boolean;
    autoNumbering: boolean;
}

export class ContentModelAutoFormatPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;
    private options: AutoFormatOptions = {
        autoBullet: true,
        autoNumbering: true,
    };

    constructor(options?: AutoFormatOptions) {
        if (options) {
            this.options = options;
        }
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelAutoFormat';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IStandaloneEditor) {
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
                case 'keyDown':
                    this.handleKeyDownEvent(this.editor, event);
                    break;
            }
        }
    }

    private handleKeyDownEvent(editor: IContentModelEditor, event: KeyDownEvent) {
        const rawEvent = event.rawEvent;
        if (!rawEvent.defaultPrevented && !event.handledByEditFeature) {
            switch (rawEvent.key) {
                case ' ':
                    const { autoBullet, autoNumbering } = this.options;
                    if (autoBullet || autoNumbering) {
                        keyboardListTrigger(editor, autoBullet, autoNumbering);
                    }

                    break;
            }
        }
    }
}
