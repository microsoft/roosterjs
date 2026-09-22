import type { MarkdownToModelOptions } from '../markdownToModel/types/MarkdownToModelOptions';

/**
 * Options for MarkdownPastePlugin
 */
export interface MarkdownPasteOptions {
    /** Options shared by automatic and explicit Markdown conversion. */
    markdownOptions?: MarkdownToModelOptions;

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
}
