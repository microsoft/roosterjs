/**
 * Enum for paste options
 */
// eslint-disable-next-line etc/no-const-enum
export const enum PasteType {
    /**
     * Default paste behavior
     */
    Normal,

    /**
     * Paste only the plain text
     */
    AsPlainText,

    /**
     * Apply the current style to pasted content
     */
    MergeFormat,

    /**
     * If there is a image uri in the clipboard, paste the content as image element
     */
    AsImage,

    /**
     * If there is plain text with links in the clipboard, paste the content as plain text with clickable links
     */
    AsPlainTextWithClickableLinks,
}
