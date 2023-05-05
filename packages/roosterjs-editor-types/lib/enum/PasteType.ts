/**
 * Enum for paste options
 */
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
}
