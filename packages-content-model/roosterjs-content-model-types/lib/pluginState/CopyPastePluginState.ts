/**
 * The state object for CopyPastePlugin
 */
export interface CopyPastePluginState {
    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     * Only text types are supported, and do not add "text/" prefix to the type values
     */
    allowedCustomPasteType: string[];
}
