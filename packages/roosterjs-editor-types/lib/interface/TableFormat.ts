/**
 * Table format
 */
interface TableFormat {
    /**
     * Background color for even rows
     */
    bgColorEven: string;

    /**
     * Background color for odd rows
     */
    bgColorOdd: string;

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
}

export default TableFormat;
