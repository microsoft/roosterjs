/**
 * Represent a virtual cell of a virtual table
 */
export default interface VCell {
    /**
     * The table cell object. The value will be null if this is an expanded virtual cell
     */
    td?: HTMLTableCellElement;

    /**
     * Whether this cell is spanned from left
     */
    spanLeft?: boolean;

    /**
     * Whether this cell is spanned from above
     */
    spanAbove?: boolean;

    /**
     * The width in pixel of the actual td (including border and padding)
     */
    width?: number;

    /**
     * The height in pixel of the actual td (including border and padding)
     */
    height?: number;

    /**
     * Wether the row is the last one in a Row.
     */
    isLastInRow?: boolean;
}
