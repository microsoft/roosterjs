/**
 * The state object for CopyPastePlugin
 */
export default interface CopyPastePluginState {
    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     */
    allowedCustomPasteType: string[];
}
