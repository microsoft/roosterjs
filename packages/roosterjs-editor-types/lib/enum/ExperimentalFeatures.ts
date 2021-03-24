/**
 * Experimental feature flags
 */
export const enum ExperimentalFeatures {
    /**
     * @deprecated This feature is always enabled
     */
    NewIndentation = 'NewIndentation',

    /**
     * @deprecated This feature is always enabled
     */
    NewBullet = 'NewBullet',

    /**
     * @deprecated This feature is always enabled
     */
    NewNumbering = 'NewNumbering',

    /**
     * @deprecated This feature is always enabled
     */
    ListChain = 'ListChain',

    /**
     * @deprecated This feature is always enabled
     */
    MergePastedLine = 'MergePastedLine',

    /**
     * Resize an image horizontally or vertically
     */
    SingleDirectionResize = 'SingleDirectionResize',

    /**
     * Try retrieve link preview information when paste
     */
    PasteWithLinkPreview = 'PasteWithLinkPreview',
}
