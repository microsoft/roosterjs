import type { ContentModelTable } from 'roosterjs-content-model-types';

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
