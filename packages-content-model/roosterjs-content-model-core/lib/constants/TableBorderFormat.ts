/**
 * Table format border
 */
export const TableBorderFormat = {
    /**
     * Minimum value
     */
    Min: 0,

    /**
     * All border of the table are displayed
     *  __ __ __
     * |__|__|__|
     * |__|__|__|
     * |__|__|__|
     */
    Default: 0,

    /**
     * Middle vertical border are not displayed
     *  __ __ __
     * |__ __ __|
     * |__ __ __|
     * |__ __ __|
     */
    ListWithSideBorders: 1,

    /**
     * All borders except header rows borders are displayed
     *  __ __ __
     *  __|__|__
     *  __|__|__
     */
    NoHeaderBorders: 2,

    /**
     * The left and right border of the table are not displayed
     *  __ __ __
     *  __|__|__
     *  __|__|__
     *  __|__|__
     */
    NoSideBorders: 3,

    /**
     * Only the borders that divides the header row, first column and externals are displayed
     *  __ __ __
     * |__ __ __|
     * |  |     |
     * |__|__ __|
     */
    FirstColumnHeaderExternal: 4,

    /**
     * The header row has no vertical border, except for the first one
     * The first column has no horizontal border, except for the first one
     *  __ __ __
     * |__ __ __
     * |  |__|__|
     * |  |__|__|
     */
    EspecialType1: 5,

    /**
     * The header row has no vertical border, except for the first one
     * The only horizontal border of the table is the top and bottom of header row
     *  __ __ __
     * |__ __ __
     * |  |     |
     * |  |     |
     */
    EspecialType2: 6,

    /**
     * The only borders are the bottom of header row and the right border of first column
     *  __ __ __
     *    |
     *    |
     */
    EspecialType3: 7,

    /**
     * No border
     */
    Clear: 8,

    /**
     * Maximum value
     */
    Max: 8,
};
