import { TableBorderFormat } from '../enum/TableBorderFormat';

/**
 * Table format
 */
export default interface TableFormat {
    /**
     * Background color
     */
    bgColor: string | null;

    /**
     * Top border color for each row
     */
    topBorderColor: string | null;

    /**
     * Bottom border color for each row
     */
    bottomBorderColor: string | null;

    /**
     * Vertical border color for each row
     */
    verticalBorderColor: string | null;

    /**
     * Set header row
     */
    headerRow: boolean;

    /**
     * Header row background color for even cells
     */
    headerRowColor: string | null;
    /**
     * Set first column
     */
    firstColumn: boolean;
    /**
     * Set banded columns
     */
    bandedColumns: boolean;

    /**
     * Background color for even columns
     */
    bgColumnColorEven: string | null;

    /**
     * Background color for odd columns
     */
    bgColumnColorOdd: string | null;
    /**
     * Set banded rows
     */
    bandedRows: boolean;

    /**
     * Background color for even rows
     */
    bgColorEven: string | null;

    /**
     * Background color for odd rows
     */
    bgColorOdd: string | null;

    /**
     * Table Borders Type
     */
    tableBorderFormat: TableBorderFormat | null;
}
