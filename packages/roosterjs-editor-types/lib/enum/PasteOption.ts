/**
 * Paste option
 */
const enum PasteOption {
    /**
     * Paste html with content type "text/html"
     */
    PasteHtml = 0,

    /**
     * Paste plain text with content type "text/plain"
     */
    PasteText = 1,

    /**
     * Paste image from clipboard with content type "image/*"
     */
    PasteImage = 2,
}

export default PasteOption;
