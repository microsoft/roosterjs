import { createLink } from './link/createLink';
import { keyboardListTrigger } from './list/keyboardListTrigger';
import { unlink } from './link/unlink';
import type {
    ContentChangedEvent,
    EditorPlugin,
    IEditor,
    KeyDownEvent,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * Options to customize the Content Model Auto Format Plugin
 */
export type AutoFormatOptions = {
    /**
     * When true, after type *, ->, -, --, => , —, > and space key a type of bullet list will be triggered. @default true
     */
    autoBullet: boolean;

    /**
     * When true, after type 1, A, a, i, I followed by ., ), - or between () and space key a type of numbering list will be triggered. @default true
     */
    autoNumbering: boolean;

    /**
     * When press backspace before a link, remove the hyperlink
     */
    autoUnlink: boolean;

    /**
     * When paste content, create hyperlink for the pasted link
     */
    autoLink: boolean;
};

/**
 * @internal
 */
const DefaultOptions: Required<AutoFormatOptions> = {
    autoBullet: true,
    autoNumbering: true,
    autoUnlink: false,
    autoLink: true,
};

/**
 * Auto Format plugin handles auto formatting, such as transforming * characters into a bullet list.
 * It can be customized with options to enable or disable auto list features.
 */
export class AutoFormatPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

    /**
     * @param options An optional parameter that takes in an object of type AutoFormatOptions, which includes the following properties:
     *  - autoBullet: A boolean that enables or disables automatic bullet list formatting. Defaults to true.
     *  - autoNumbering: A boolean that enables or disables automatic numbering formatting. Defaults to true.
     */
    constructor(private options: AutoFormatOptions = DefaultOptions) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'AutoFormat';
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
        if (this.editor) {
            switch (event.eventType) {
                case 'keyDown':
                    this.handleKeyDownEvent(this.editor, event);
                    break;
                case 'contentChanged':
                    this.handleContentChangedEvent(this.editor, event);
                    break;
            }
        }
    }

    private handleKeyDownEvent(editor: IEditor, event: KeyDownEvent) {
        const rawEvent = event.rawEvent;
        if (!rawEvent.defaultPrevented && !event.handledByEditFeature) {
            const { autoBullet, autoNumbering, autoUnlink } = this.options;
            switch (rawEvent.key) {
                case ' ':
                    if (autoBullet || autoNumbering) {
                        keyboardListTrigger(editor, rawEvent, autoBullet, autoNumbering);
                    }
                    break;
                case 'Backspace':
                    if (autoUnlink) {
                        unlink(editor, rawEvent);
                    }

                    break;
            }
        }
    }

    private handleContentChangedEvent(editor: IEditor, event: ContentChangedEvent) {
        const { autoLink } = this.options;
        if (event.source == 'Paste' && autoLink) {
            createLink(editor);
        }
    }
}
