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
     * @deprecated This feature is always enabled
     * Check if the element has a style attribute, if not, apply the default format
     */
    AlwaysApplyDefaultFormat = 'AlwaysApplyDefaultFormat',

    /**
     * Paste the Html instead of the Img when the Html Body only have one IMG Child node
     */
    ConvertSingleImageBody = 'ConvertSingleImageBody',

    /**
     * Align table elements to left, center and right using setAlignment API
     */
    TableAlignment = 'TableAlignment',

    /**
     * Provide additional Tab Key Features. Requires Text Features Content Editable Features
     */
    TabKeyTextFeatures = 'TabKeyTextFeatures',

    /**
     * Provide a circular resize handles that adaptive the number od handles to the size of the image
     */
    AdaptiveHandlesResizer = 'AdaptiveHandlesResizer',

    /**
     * Align list elements elements to left, center and right using setAlignment API
     */
    ListItemAlignment = 'ListItemAlignment',

    /**
     * Trigger formatting by a especial characters. Ex: (A), 1. i).
     */
    AutoFormatList = 'AutoFormatList',

    /**
     * @deprecated this feature is always disabled
     * Automatically transform -- into hyphen, if typed between two words.
     */
    AutoHyphen = 'AutoHyphen',

    /**
     * Use pending format strategy to do style based format, e.g. Font size, Color.
     * With this feature enabled, we don't need to insert temp ZeroWidthSpace character to hold pending format
     * when selection is collapsed. Instead, we will hold the pending format in memory and only apply it when type something
     */
    PendingStyleBasedFormat = 'PendingStyleBasedFormat',
}
