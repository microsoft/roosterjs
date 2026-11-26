/**
 * CSS multi-column layout of a format container.
 */
export type ColumnFormat = {
    /**
     * Number of equal columns, or auto.
     */
    columnCount?: string;
    /**
     * Space between columns.
     */
    columnGap?: string;
    /**
     * Standard CSS rule drawn between columns.
     */
    columnRule?: string;
};
