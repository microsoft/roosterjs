/**
 * Table format border
 */
export enum TableBorderFormat {
    /**
     * All border of the table are displayed
     *  __ __ __
     * |__|__|__|
     * |__|__|__|
     * |__|__|__|
     */
    DEFAULT,

    /**
     * Middle vertical border are not displayed
     *  __ __ __
     * |__ __ __|
     * |__ __ __|
     * |__ __ __|
     */
    LIST_WITH_SIDE_BORDERS,

    /**
     * All borders except header rows borders are displayed
     *  __ __ __
     *  __|__|__
     *  __|__|__
     */
    NO_HEADER_BORDERS,

    /**
     * The left and right border of the table are not displayed
     *  __ __ __
     *  __|__|__
     *  __|__|__
     *  __|__|__
     */
    NO_SIDE_BORDERS,

    /**
     * Only the borders that divides the header row, first column and externals are displayed
     *  __ __ __
     * |__ __ __|
     * |  |     |
     * |__|__ __|
     */
    FIRST_COLUMN_HEADER_EXTERNAL,

    /**
     * The header row has no vertical border, except for the first one
     * The first column has no horizontal border, except for the first one
     *  __ __ __
     * |__ __ __
     * |  |__|__|
     * |  |__|__|
     */
    ESPECIAL_TYPE_1,

    /**
     * The header row has no vertical border, except for the first one
     * The only horizontal border of the table is the top and bottom of header row
     *  __ __ __
     * |__ __ __
     * |  |     |
     * |  |     |
     */
    ESPECIAL_TYPE_2,

    /**
     * The only borders are the bottom of header row and the right border of first column
     *  __ __ __
     *    |
     *    |
     */
    ESPECIAL_TYPE_3,

    /**
     * No border
     */
    CLEAR,
}

/**
 * Format of table that stored as metadata
 */
export type TableMetadataFormat = {
    /**
     * Top border color for each row
     */
    topBorderColor?: string | null;

    /**
     * Bottom border color for each row
     */
    bottomBorderColor?: string | null;

    /**
     * Vertical border color for each row
     */
    verticalBorderColor?: string | null;

    /**
     * Set header row
     */
    hasHeaderRow?: boolean;

    /**
     * Header row background color for even cells
     */
    headerRowColor?: string | null;

    /**
     * Set first column
     */
    hasFirstColumn?: boolean;

    /**
     * Set banded columns
     */
    hasBandedColumns?: boolean;

    /**
     * Set banded rows
     */
    hasBandedRows?: boolean;

    /**
     * Background color for even row or even columns
     */
    bgColorEven?: string | null;

    /**
     * Background color for odd row or odd columns
     */
    bgColorOdd?: string | null;

    /**
     * Table Borders Type
     */
    tableBorderFormat?: TableBorderFormat;
    /**
     * Vertical alignment for each row
     */
    verticalAlign?: 'top' | 'middle' | 'bottom' | null;
};
