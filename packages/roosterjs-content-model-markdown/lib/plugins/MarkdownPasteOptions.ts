import type { MarkdownToModelOptions } from '../markdownToModel/types/MarkdownToModelOptions';

/**
 * Options for MarkdownPastePlugin
 */
export interface MarkdownPasteOptions {
    /**
     * When true, content that can be interpreted as markdown is automatically converted
     * into rich content on every paste, without requiring an explicit "Paste as Markdown"
     * command.
     * @default false
     */
    autoConversion: boolean;

    /**
     * When true, the plugin will undo the markdown conversion when the user undoes the action.
     * @default false
     */
    undoConversion: boolean;

    /**
     * Options for converting pasted markdown text into a content model.
     * An omitted or undefined emptyLine option defaults to 'merge'.
     */
    markdownToModelOptions?: MarkdownToModelOptions;
}
