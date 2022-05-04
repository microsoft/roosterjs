/**
 * Operations used by editTable() API
 */
export const enum TableOperation {
    /**
     * Insert a row above current row
     */
    InsertAbove,

    /**
     * Insert a row below current row
     */
    InsertBelow,

    /**
     * Insert a column on the left of current column
     */
    InsertLeft,

    /**
     * Insert a column on the right of current column
     */
    InsertRight,

    /**
     * Delete the whole table
     */
    DeleteTable,

    /**
     * Delete current column
     */
    DeleteColumn,

    /**
     * Delete current row
     */
    DeleteRow,

    /**
     * Merge current row with the row above
     */
    MergeAbove,

    /**
     * Merge current row with the row below
     */
    MergeBelow,

    /**
     * Merge current column with the column on the left
     */
    MergeLeft,

    /**
     * Merge current column with the column on the right
     */
    MergeRight,

    /**
     * Merge all selected cells
     */
    MergeCells,

    /**
     * Split current table cell horizontally
     */
    SplitHorizontally,

    /**
     * Split current table cell vertically
     */
    SplitVertically,

    /**
     * Align current table at the center
     */
    AlignCenter,

    /**
     * Align current table at the left
     */
    AlignLeft,

    /**
     * Align current table at the right
     */
    AlignRight,

    /**
     * Align current content table cell at the left
     */
    AlignCellLeft,

    /**
     * Align current content table cell at the center
     */
    AlignCellCenter,

    /**
     * Align current content table cell at the right
     */
    AlignCellRight,

    /**
     * Align current content table cell at the top
     */
    AlignCellTop,

    /**
     * Align current table cell at the middle
     */
    AlignCellMiddle,

    /**
     * Align current table cell at the bottom
     */
    AlignCellBottom,
}
