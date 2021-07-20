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

    /**
     * Rotate an inline image (requires ImageEdit plugin)
     */
    ImageRotate = 'ImageRotate',

    /**
     * Crop an inline image (requires ImageEdit plugin)
     */
    ImageCrop = 'ImageCrop',
    /**
     * Check if the element has a style attribute, if not, apply the default format
     */
    AlwaysApplyDefaultFormat = 'AlwaysApplyDefaultFormat',
}
