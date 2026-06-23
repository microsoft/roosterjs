import { convertMarkdownToContentModel } from '../markdownToModel/convertMarkdownToContentModel';
import { isPastedContentMarkdown } from '../publicApi/isPastedContentMarkdown';
import {
    contentModelToDom,
    createModelToDomContext,
    mergeModel,
} from 'roosterjs-content-model-dom';

import type { MarkdownPasteOptions } from './MarkdownPasteOptions';
import type {
    ClipboardData,
    EditorPlugin,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

const DefaultOptions: MarkdownPasteOptions = {
    autoConversion: false,
    undoConversion: false,
};

/**
 * Markdown paste plugin. Handles the BeforePaste event and, when the pasted content
 * can be interpreted as markdown, converts the plain text into a Content Model and
 * pastes it as rich markdown content instead of the original clipboard HTML.
 */
export class MarkdownPastePlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private options: MarkdownPasteOptions;

    /**
     * Construct a new instance of MarkdownPastePlugin
     * @param options Options to control the markdown paste behavior
     */
    constructor(options?: MarkdownPasteOptions) {
        this.options = options ?? DefaultOptions;
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'MarkdownPaste';
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
        if (
            event.eventType == 'contentChanged' &&
            event.source == 'Paste' &&
            this.options.autoConversion
        ) {
            const clipboardData = event.data as ClipboardData;
            const shouldConvert = this.options.autoConversion && clipboardData.pasteNativeEvent;
            if (
                shouldConvert &&
                isPastedContentMarkdown(this.editor, clipboardData) &&
                clipboardData.modelBeforePaste
            ) {
                mergeModel(
                    clipboardData.modelBeforePaste,
                    convertMarkdownToContentModel(clipboardData.text, { emptyLine: 'merge' })
                );
                if (this.options.undoConversion) {
                    this.editor.takeSnapshot();
                }
                this.editor.formatContentModel(
                    model => {
                        if (!clipboardData.modelBeforePaste) {
                            return false;
                        }
                        model.blocks = clipboardData.modelBeforePaste.blocks;
                        return true;
                    },
                    {
                        apiName: 'MarkdownConversion',
                    }
                );
            }
        } else if (event.eventType == 'beforePaste' && !event.clipboardData.pasteNativeEvent) {
            const shouldConvert = event.pasteType === 'asMarkdown';
            if (shouldConvert && isPastedContentMarkdown(this.editor, event.clipboardData)) {
                convertPastedTextToMarkdown(this.editor, event.fragment, event.clipboardData.text);
            }
        }
    }
}

function convertPastedTextToMarkdown(editor: IEditor, fragment: DocumentFragment, text: string) {
    const model = convertMarkdownToContentModel(text, {
        emptyLine: 'merge',
    });

    while (fragment.firstChild) {
        fragment.removeChild(fragment.firstChild);
    }

    contentModelToDom(editor.getDocument(), fragment, model, createModelToDomContext());
}
