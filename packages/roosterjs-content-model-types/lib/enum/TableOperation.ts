/**
 * Operations used by editTable() API for insert table cell vertically
 */
export type TableVerticalInsertOperation =
    /**
     * Insert a row above current row
     */
    | 'insertAbove'

    /**
     * Insert a row below current row
     */
    | 'insertBelow';

/**
 * Operations used by editTable() API for insert table cell horizontally
 */
export type TableHorizontalInsertOperation =
    /**
     * Insert a column on the left of current column
     */
    | 'insertLeft'

    /**
     * Insert a column on the right of current column
     */
    | 'insertRight';

/**
 * Operations used by editTable() API for delete table cells
 */
export type TableDeleteOperation =
    /**
     * Delete the whole table
     */
    | 'deleteTable'

    /**
     * Delete current column
     */
    | 'deleteColumn'

    /**
     * Delete current row
     */
    | 'deleteRow';

/**
 * Operations used by editTable() API for merge table cells vertically
 */
export type TableVerticalMergeOperation =
    /**
     * Merge current row with the row above
     */
    | 'mergeAbove'

    /**
     * Merge current row with the row below
     */
    | 'mergeBelow';

/**
 * Operations used by editTable() API for merge table cells horizontally
 */
export type TableHorizontalMergeOperation =
    /**
     * Merge current column with the column on the left
     */
    | 'mergeLeft'

    /**
     * Merge current column with the column on the right
     */
    | 'mergeRight';

/**
 * Operations used by editTable() API for merge selected table cells
 */
export type TableCellMergeOperation =
    /**
     * Merge all selected cells
     */
    'mergeCells';

/**
 * Operations used by editTable() API for split table cells
 */
export type TableSplitOperation =
    /**
     * Split current table cell horizontally
     */
    | 'splitHorizontally'

    /**
     * Split current table cell vertically
     */
    | 'splitVertically';

/**
 * Operations used by editTable() API for align table
 */
export type TableAlignOperation =
    /**
     * Align current table at the center
     */
    | 'alignCenter'

    /**
     * Align current table at the left
     */
    | 'alignLeft'

    /**
     * Align current table at the right
     */
    | 'alignRight';

/**
 * Operations used by editTable() API for align table cell horizontally
 */
export type TableCellHorizontalAlignOperation =
    /**
     * Align current content table cell at the left
     */
    | 'alignCellLeft'

    /**
     * Align current content table cell at the center
     */
    | 'alignCellCenter'

    /**
     * Align current content table cell at the right
     */
    | 'alignCellRight';

/**
 * Operations used by editTable() API for align table cell vertically
 */
export type TableCellVerticalAlignOperation =
    /**
     * Align current content table cell at the top
     */
    | 'alignCellTop'

    /**
     * Align current table cell at the middle
     */
    | 'alignCellMiddle'

    /**
     * Align current table cell at the bottom
     */
    | 'alignCellBottom';

/**
 * Operations used by editTable() API to shift table cell content up or left
 */
export type TableCellShiftOperation =
    /**
     * Move the table cell content to the cell on the left
     */
    | 'shiftCellsLeft'

    /**
     * Move the table cell content to the cell above
     */
    | 'shiftCellsUp';

/**
 * Operations used by editTable() API
 */
export type TableOperation =
    | TableVerticalInsertOperation
    | TableHorizontalInsertOperation
    | TableDeleteOperation
    | TableVerticalMergeOperation
    | TableHorizontalMergeOperation
    | TableCellMergeOperation
    | TableSplitOperation
    | TableAlignOperation
    | TableCellHorizontalAlignOperation
    | TableCellVerticalAlignOperation
    | TableCellShiftOperation;
