/**
 * Enum for paste options
 */
export const enum PasteType {
    /**
     * Simple paste with not content change
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
     * Paste the content as image element
     */
    AsImage,
}
