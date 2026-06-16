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
}
