const enum TableOperation {
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
     * Split current table cell horizontally
     */
    SplitHorizontally,

    /**
     * Split current table cell vertically
     */
    SplitVertically,
}

export default TableOperation;
