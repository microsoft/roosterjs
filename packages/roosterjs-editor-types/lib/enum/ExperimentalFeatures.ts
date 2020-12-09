/**
 * Experimental feature flags
 */
export const enum ExperimentalFeatures {
    /**
     * Toggle indentation using VList
     */
    NewIndentation = 'NewIndentation',

    /**
     * Toggle bullet using VList
     */
    NewBullet = 'NewBullet',

    /**
     * Toggle numbering using VList
     */
    NewNumbering = 'NewNumbering',

    /**
     * Enable List Chain for numbering list
     */
    ListChain = 'ListChain',

    /**
     * When paste, try merge pasted content to the same line with existing content
     */
    MergePastedLine = 'MergePastedLine',

    /**
     * Resize an image horizontally or vertically
     */
    SingleDirectionResize = 'SingleDirectionResize',

    /**
     * Try retrieve linke preview information when paste
     */
    PasteWithLinkPreview = 'PasteWithLinkPreview',
}
