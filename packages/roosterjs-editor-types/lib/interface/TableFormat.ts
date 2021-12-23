import { TableBorderFormat } from '../enum/TableBorderFormat';

/**
 * Table format
 */
export default interface TableFormat {
    /**
     * Background color
     */
    bgColor: string;

    /**
     * Top border color for each row
     */
    topBorderColor: string;

    /**
     * Bottom border color for each row
     */
    bottomBorderColor: string;

    /**
     * Vertical border color for each row
     */
    verticalBorderColor: string;

    /**
     * Set header row
     */
    headerRow: boolean;

    /**
     * Header row background color for even cells
     */
    headerRowColor: string;
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
    bgColumnColorEven: string;

    /**
     * Background color for odd columns
     */
    bgColumnColorOdd: string;
    /**
     * Set banded rows
     */
    bandedRows: boolean;

    /**
     * Background color for even rows
     */
    bgColorEven: string;

    /**
     * Background color for odd rows
     */
    bgColorOdd: string;

    /**
     * Table Borders Type
     */
    tableBorderFormat: TableBorderFormat;
}
