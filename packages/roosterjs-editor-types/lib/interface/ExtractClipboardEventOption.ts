/**
 * Options for extractClipboardEvent API
 */
export default interface ExtractClipboardEventOption {
    /**
     * @deprecated
     * Whether retrieving value of text/link-preview is allowed
     */
    allowLinkPreview?: boolean;

    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     * Only text types are supported, and do not add "text/" prefix to the type values
     */
    allowedCustomPasteType?: string[];
}
