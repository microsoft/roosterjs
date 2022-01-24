/**
 * Table format border
 */
export const enum TableBorderFormat {
    /**
     * Default border type
     */
    DEFAULT,
    /**
     * Only the top, bottom, left and right border of the table are displayed
     */
    EXTERNAL,
    /**
     * All borders except header rows borders are displayed
     */
    NO_HEADER_VERTICAL,
    /**
     * All borders except left and right border of the table are displayed
     */
    MIDDLE,
    /**
     * Only the borders of header row, first column and whole table are displayed
     */
    FIRST_COLUMN_HEADER_EXTERNAL,
}
