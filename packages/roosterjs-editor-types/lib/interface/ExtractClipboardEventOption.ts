/**
 * Options for extractClipboardEvent API
 */
export default interface ExtractClipboardEventOption {
    /**
     * Whether retrieving value of text/link-preview is allowed
     */
    allowLinkPreview?: boolean;

    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     */
    allowedCustomPasteType?: string[];
}
