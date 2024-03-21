import { setFormat } from './utils/setFormat';
import type {
    ContentModelSegmentFormat,
    EditorPlugin,
    IEditor,
    KeyDownEvent,
    PluginEvent,
} from 'roosterjs-content-model-types';

export interface MarkdownOptions {
    strikethrough?: boolean;
    bold?: boolean;
    italic?: boolean;
}

/**
 * @internal
 */
const DefaultOptions: Required<MarkdownOptions> = {
    strikethrough: true,
    bold: true,
    italic: true,
};

interface Markdown {
    character: string;
    format: ContentModelSegmentFormat;
}

/**
 * Markdown plugin handles markdown formatting, such as transforming * characters into bold text.
 */
export class MarkdownPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private lastCharacterAndFormat: Markdown | undefined = undefined;

    /**
     * @param options An optional parameter that takes in an object of type MarkdownOptions, which includes the following properties:
     *  - strikethrough: If true text between ~ will receive strikethrough format. Defaults to true.
     *  - bold: If true text between * will receive bold format. Defaults to true.
     *  - italic: If true text between _ will receive italic format. Defaults to true.
     */
    constructor(private options: MarkdownOptions = DefaultOptions) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'Markdown';
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
        this.lastCharacterAndFormat = undefined;
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

    private handleKeyDownEvent(editor: IEditor, event: KeyDownEvent) {
        const rawEvent = event.rawEvent;
        const { strikethrough, bold, italic } = this.options;
        const selection = editor.getDOMSelection();
        if (
            !rawEvent.defaultPrevented &&
            !event.handledByEditFeature &&
            selection &&
            selection.type == 'range' &&
            selection.range.collapsed
        ) {
            if (rawEvent.shiftKey) {
                switch (rawEvent.key) {
                    case '*':
                        if (bold) {
                            this.lastCharacterAndFormat = {
                                character: '*',
                                format: { fontWeight: 'bold' },
                            };
                        }
                        break;
                    case '~':
                        if (strikethrough) {
                            this.lastCharacterAndFormat = {
                                character: '~',
                                format: { strikethrough: true },
                            };
                        }
                        break;
                    case '_':
                        if (italic) {
                            this.lastCharacterAndFormat = {
                                character: '_',
                                format: { italic: true },
                            };
                        }
                }
            }

            if (rawEvent.key === ' ' && this.lastCharacterAndFormat) {
                const { character, format } = this.lastCharacterAndFormat;
                setFormat(editor, character, format);
                this.lastCharacterAndFormat = undefined;
            }
        }
    }
}
