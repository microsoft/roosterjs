/**
 * Experimental feature flags
 */
export const enum ExperimentalFeatures {
    // #region Graduated and deprecated features.
    // These features will be removed in next major release
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
     * @deprecated This feature is always enabled
     */
    SingleDirectionResize = 'SingleDirectionResize',

    /**
     * @deprecated This feature is always enabled
     */
    PasteWithLinkPreview = 'PasteWithLinkPreview',

    /**
     * @deprecated This feature is always enabled
     */
    ImageRotate = 'ImageRotate',

    /**
     * @deprecated This feature is always enabled
     */
    ImageCrop = 'ImageCrop',

    /**
     * @deprecated This feature is always enabled
     * Check if the element has a style attribute, if not, apply the default format
     */
    AlwaysApplyDefaultFormat = 'AlwaysApplyDefaultFormat',

    /**
     * @deprecated This feature can be enabled/disabled using Paste Plugin contructor param
     * Paste the Html instead of the Img when the Html Body only have one IMG Child node
     */
    ConvertSingleImageBody = 'ConvertSingleImageBody',

    /**
     * @deprecated This feature is always enabled
     * Align table elements to left, center and right using setAlignment API
     */
    TableAlignment = 'TableAlignment',

    /**
     * @deprecated this feature is always enabled
     * Provide a circular resize handles that adaptive the number od handles to the size of the image
     */
    AdaptiveHandlesResizer = 'AdaptiveHandlesResizer',

    /**
     * @deprecated this feature is always disabled
     * Automatically transform -- into hyphen, if typed between two words.
     */
    AutoHyphen = 'AutoHyphen',

    /**
     * @deprecated this feature is always disabled
     * Use pending format strategy to do style based format, e.g. Font size, Color.
     * With this feature enabled, we don't need to insert temp ZeroWidthSpace character to hold pending format
     * when selection is collapsed. Instead, we will hold the pending format in memory and only apply it when type something
     */
    PendingStyleBasedFormat = 'PendingStyleBasedFormat',

    /**
     * @deprecated this feature is always disabled
     * Normalize list to make sure it can be displayed correctly in other client
     * e.g. We will move list items with "display: block" into previous list item and change tag to be DIV
     */
    NormalizeList = 'NormalizeList',

    /**
     * @deprecated this feature is always enabled
     * When a html image is selected, the selected image data will be stored by editor core.
     */
    ImageSelection = 'ImageSelection',

    /**
     * @deprecated this feature is always enabled
     * Use variable-based dark mode solution rather than dataset-based solution.
     * When enable this feature, need to pass in a DarkModelHandler object to each call of setColor and applyFormat
     * if you need them work for dark mode
     */
    VariableBasedDarkColor = 'VariableBasedDarkColor',

    /**
     * @deprecated this feature is always enabled
     * Align list elements elements to left, center and right using setAlignment API
     */
    ListItemAlignment = 'ListItemAlignment',

    /**
     * @deprecated
     */
    DefaultFormatInSpan = 'DefaultFormatInSpan',

    /**
     * @deprecated
     */
    DefaultFormatOnContainer = 'DefaultFormatOnContainer',

    //#endregion

    /**
     * Provide additional Tab Key Features. Requires Text Features Content Editable Features
     */
    TabKeyTextFeatures = 'TabKeyTextFeatures',

    /**
     * Trigger formatting by a especial characters. Ex: (A), 1. i).
     */
    AutoFormatList = 'AutoFormatList',

    /**
     * With this feature enabled, when writing back a list item we will re-use all
     * ancestor list elements, even if they don't match the types currently in the
     * listTypes array for that item. The only list that we will ensure is correct
     * is the one closest to the item.
     */
    ReuseAllAncestorListElements = 'ReuseAllAncestorListElements',

    /**
     * Reuse existing DOM structure if possible when convert Content Model back to DOM tree
     */
    ReusableContentModel = 'ReusableContentModel',

    /**
     * Handle keyboard editing event with Content Model
     */
    EditWithContentModel = 'EditWithContentModel',

    /**
     * Delete table with Backspace key with the whole was selected with table selector
     */
    DeleteTableWithBackspace = 'DeleteTableWithBackspace',

    /**
     * Add entities around a Read Only  Inline entity to prevent cursor to be hidden when cursor is next of it.
     */
    InlineEntityReadOnlyDelimiters = 'InlineEntityReadOnlyDelimiters',

    /**
     * Paste with Content model
     */
    ContentModelPaste = 'ContentModelPaste',
}
