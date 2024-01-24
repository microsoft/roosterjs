import { keyboardListTrigger } from './keyboardListTrigger';
import type {
    EditorPlugin,
    IStandaloneEditor,
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
};

/**
 * @internal
 */
const DefaultOptions: Required<AutoFormatOptions> = {
    autoBullet: true,
    autoNumbering: true,
};

/**
 * Auto Format plugin handles auto formatting, such as transforming * characters into a bullet list.
 * It can be customized with options to enable or disable auto list features.
 */
export class ContentModelAutoFormatPlugin implements EditorPlugin {
    private editor: IStandaloneEditor | null = null;

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
        return 'ContentModelAutoFormat';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IStandaloneEditor) {
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
            }
        }
    }

    private handleKeyDownEvent(editor: IStandaloneEditor, event: KeyDownEvent) {
        const rawEvent = event.rawEvent;
        if (!rawEvent.defaultPrevented && !event.handledByEditFeature) {
            switch (rawEvent.key) {
                case ' ':
                    const { autoBullet, autoNumbering } = this.options;
                    if (autoBullet || autoNumbering) {
                        keyboardListTrigger(editor, rawEvent, autoBullet, autoNumbering);
                    }
                    break;
            }
        }
    }
}
