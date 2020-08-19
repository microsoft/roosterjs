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
}
