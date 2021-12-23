/**
 * Table format border
 */

export enum TableBorderFormat {
    /**
     * Only the top, bottom, left and right border of the table are displayed
     */
    onlyExternalBorders = 'onlyExternalBorders',
    /**
     * All borders except header rows border are displayed
     */
    removeHeaderRowMiddleBorder = 'removeHeaderRowMiddleBorder',
    /**
     * All borders except left and right border of the table are displayed
     */
    onlyMiddleBorders = 'onlyInternalBorders',
    /**
     * Only the top, bottom, left and right border of the table are displayed
     */
    onlyExternalHeaderRowAndFirstColumnBorders = 'onlyExternalHeaderRowAndFirstColumnBorders',
}
