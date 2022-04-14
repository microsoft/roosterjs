/**
 * Index of known CreateElementData used by createElement function
 */
export enum KnownCreateElementDataIndex {
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
     * Table resizer elements
     */
    TableHorizontalResizer = 7,
    TableVerticalResizer = 8,
    TableResizerLTR = 9,
    TableResizerRTL = 10,
    /**
     * Table Selector element
     */
    TableSelector = 11,
}
