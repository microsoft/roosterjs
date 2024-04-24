import { setFormat } from './utils/setFormat';
import type {
    ContentChangedEvent,
    ContentModelCodeFormat,
    EditorInputEvent,
    EditorPlugin,
    IEditor,
    KeyDownEvent,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 *
 * Options for Markdown plugin
 *  - strikethrough: If true text between ~ will receive strikethrough format.
 *  - bold: If true text between * will receive bold format.
 *  - italic: If true text between _ will receive italic format.
 *  - codeFormat: If provided, text between ` will receive code format. If equal to {}, it will set the default code format.
 */
export interface MarkdownOptions {
    strikethrough?: boolean;
    bold?: boolean;
    italic?: boolean;
    codeFormat?: ContentModelCodeFormat;
}

/**
 * @internal
 */
const DefaultOptions: Partial<MarkdownOptions> = {
    strikethrough: false,
    bold: false,
    italic: false,
};

/**
 * Markdown plugin handles markdown formatting, such as transforming * characters into bold text.
 */
export class MarkdownPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private shouldBold = false;
    private shouldItalic = false;
    private shouldStrikethrough = false;
    private shouldCode = false;
    private lastKeyTyped: string | null = null;

    /**
     * @param options An optional parameter that takes in an object of type MarkdownOptions, which includes the following properties:
     *  - strikethrough: If true text between ~ will receive strikethrough format. Defaults to false.
     *  - bold: If true text between * will receive bold format. Defaults to false.
     *  - italic: If true text between _ will receive italic format. Defaults to false.
     *  - codeFormat: If provided, text between ` will receive code format. Defaults to undefined.
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
        this.disableAllFeatures();
        this.lastKeyTyped = null;
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
                case 'input':
                    this.handleEditorInputEvent(this.editor, event);
                    break;
                case 'keyDown':
                    this.handleBackspaceEvent(event);
                    this.handleKeyDownEvent(event);
                    break;
                case 'contentChanged':
                    this.handleContentChangedEvent(event);
                    break;
            }
        }
    }

    private handleEditorInputEvent(editor: IEditor, event: EditorInputEvent) {
        const rawEvent = event.rawEvent;
        const selection = editor.getDOMSelection();
        if (
            selection &&
            selection.type == 'range' &&
            selection.range.collapsed &&
            rawEvent.inputType == 'insertText'
        ) {
            switch (rawEvent.data) {
                case '*':
                    if (this.options.bold) {
                        if (this.shouldBold) {
                            setFormat(editor, '*', { fontWeight: 'bold' });
                            this.shouldBold = false;
                        } else {
                            this.shouldBold = true;
                        }
                    }

                    break;
                case '~':
                    if (this.options.strikethrough) {
                        if (this.shouldStrikethrough) {
                            setFormat(editor, '~', { strikethrough: true });
                            this.shouldStrikethrough = false;
                        } else {
                            this.shouldStrikethrough = true;
                        }
                    }
                    break;
                case '_':
                    if (this.options.italic) {
                        if (this.shouldItalic) {
                            setFormat(editor, '_', { italic: true });
                            this.shouldItalic = false;
                        } else {
                            this.shouldItalic = true;
                        }
                    }
                    break;
                case '`':
                    if (this.options.codeFormat) {
                        if (this.shouldCode) {
                            setFormat(editor, '`', {} /* format */, this.options.codeFormat);
                            this.shouldCode = false;
                        } else {
                            this.shouldCode = true;
                        }
                    }
                    break;
            }
        }
    }

    private handleKeyDownEvent(event: KeyDownEvent) {
        const rawEvent = event.rawEvent;
        if (!event.handledByEditFeature && !rawEvent.defaultPrevented) {
            switch (rawEvent.key) {
                case 'Enter':
                    this.disableAllFeatures();
                    this.lastKeyTyped = null;
                    break;
                case ' ':
                    if (this.lastKeyTyped === '*' && this.shouldBold) {
                        this.shouldBold = false;
                    } else if (this.lastKeyTyped === '~' && this.shouldStrikethrough) {
                        this.shouldStrikethrough = false;
                    } else if (this.lastKeyTyped === '_' && this.shouldItalic) {
                        this.shouldItalic = false;
                    } else if (this.lastKeyTyped === '`' && this.shouldCode) {
                        this.shouldCode = false;
                    }
                    this.lastKeyTyped = null;
                    break;
                default:
                    this.lastKeyTyped = rawEvent.key;
                    break;
            }
        }
    }

    private handleBackspaceEvent(event: KeyDownEvent) {
        if (!event.handledByEditFeature && event.rawEvent.key === 'Backspace') {
            if (this.lastKeyTyped === '*' && this.shouldBold) {
                this.shouldBold = false;
            } else if (this.lastKeyTyped === '~' && this.shouldStrikethrough) {
                this.shouldStrikethrough = false;
            } else if (this.lastKeyTyped === '_' && this.shouldItalic) {
                this.shouldItalic = false;
            } else if (this.lastKeyTyped === '`' && this.shouldCode) {
                this.shouldCode = false;
            }
            this.lastKeyTyped = null;
        }
    }

    private handleContentChangedEvent(event: ContentChangedEvent) {
        if (event.source == 'Format') {
            this.disableAllFeatures();
        }
    }

    private disableAllFeatures() {
        this.shouldBold = false;
        this.shouldItalic = false;
        this.shouldStrikethrough = false;
        this.shouldCode = false;
    }
}
