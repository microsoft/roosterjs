import { ContentModelTable } from '../block/ContentModelTable';

/**
 * Represents the context of a selected table cell
 */
export interface TableSelectionContext {
    /**
     * The table Content Model that contains selected table cell
     */
    table: ContentModelTable;

    /**
     * Row index of selected table cell
     */
    rowIndex: number;

    /**
     * Column index of selected table cell
     */
    colIndex: number;
}
