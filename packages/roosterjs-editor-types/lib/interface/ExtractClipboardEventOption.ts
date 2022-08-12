/**
 * Options for ExtractClipboardItems API
 */
export interface ExtractClipboardItemsOption {
    /**
     * @deprecated This feature is always enabled
     */
    allowLinkPreview?: boolean;

    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     * Only text types are supported, and do not add "text/" prefix to the type values
     */
    allowedCustomPasteType?: string[];
}

/**
 * Options for ExtractClipboardItemsForIE API
 */
export interface ExtractClipboardItemsForIEOptions {
    /**
     * A callback to help create a temporary DIV for IE to receive pasted content
     */
    getTempDiv?: () => HTMLDivElement;

    /**
     * A callback to help remove the temporary DIV for IE
     */
    removeTempDiv?: (div: HTMLDivElement) => void;
}

/**
 * @deprecated
 * Options for extractClipboardEvent API
 */
export default interface ExtractClipboardEventOption
    extends ExtractClipboardItemsOption,
        ExtractClipboardItemsForIEOptions {}
