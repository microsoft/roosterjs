/**
 * Types of Selection Ranges that the SelectionRangeEx can return
 */
// eslint-disable-next-line etc/no-const-enum
export const enum SelectionRangeTypes {
    /**
     * Normal selection range provided by browser.
     */
    Normal,
    /**
     * Selection made inside of a single table.
     */
    TableSelection,
    /**
     * Selection made in a image.
     */
    ImageSelection,
}
