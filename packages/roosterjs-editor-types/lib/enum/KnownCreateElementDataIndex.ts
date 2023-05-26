/**
 * Index of known CreateElementData used by createElement function
 */
export const enum KnownCreateElementDataIndex {
    /**
     * Set a none value to help createElement function ignore falsy value
     */
    None = 0,

    /**
     * An empty line without format
     */
    EmptyLine = 1,

    /**
     * Wrapper for blockquote
     */
    BlockquoteWrapper = 2,

    /**
     * Temp DIV for copy/paste
     */
    CopyPasteTempDiv = 3,

    /**
     * ListItem with block style
     */
    BlockListItem = 4,

    /**
     * Wrapper element for context menu
     */
    ContextMenuWrapper = 5,

    /**
     * Wrapper element for image edit
     */
    ImageEditWrapper = 6,

    /**
     * @deprecated
     */
    TableHorizontalResizer = 7,

    /**
     * @deprecated
     */
    TableVerticalResizer = 8,

    /**
     * @deprecated
     */
    TableResizerLTR = 9,

    /**
     * @deprecated
     */
    TableResizerRTL = 10,

    /**
     * @deprecated
     */
    TableSelector = 11,

    /**
     * @deprecated
     */
    EmptyLineFormatInSpan = 12,
}
