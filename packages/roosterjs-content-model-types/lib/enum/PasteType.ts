/**
 * Specify what type of content to paste
 */
export type PasteType =
    /**
     * Default paste behavior
     */
    | 'normal'

    /**
     * Paste only the plain text
     */
    | 'asPlainText'

    /**
     * Apply the current style to pasted content
     */
    | 'mergeFormat'

    /**
     * If there is a image uri in the clipboard, paste the content as image element
     */
    | 'asImage'

    /**
     * If the editor includes a markdown plugin @see MarkdownPastePlugin, and there is markdown content in the clipboard, paste it as markdown
     */
    | 'asMarkdown';
