import type {
    ContentModelTable,
    ReadonlyContentModelTable,
} from '../contentModel/block/ContentModelTable';

/**
 * Context object for table in a selection
 */
export interface TableSelectionContext {
    /**
     * The table that contains the selection
     */
    table: ContentModelTable;

    /**
     * Row Index of the selected table cell
     */
    rowIndex: number;

    /**
     * Column Index of the selected table cell
     */
    colIndex: number;

    /**
     * Whether the whole table is selected
     */
    isWholeTableSelected: boolean;
}

/**
 * Context object for table in a selection
 */
export interface ReadonlyTableSelectionContext {
    /**
     * The table that contains the selection
     */
    table: ReadonlyContentModelTable;

    /**
     * Row Index of the selected table cell
     */
    rowIndex: number;

    /**
     * Column Index of the selected table cell
     */
    colIndex: number;

    /**
     * Whether the whole table is selected
     */
    isWholeTableSelected: boolean;
}
