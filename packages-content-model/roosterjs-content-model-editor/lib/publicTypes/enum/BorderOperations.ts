/**
 * All Border operations
 */
export type BorderOperations =
    /**
     * Apply border format to all borders
     */
    | 'allBorders'
    /**
     * Remove al borders
     */
    | 'noBorders'
    /**
     * Apply border format to left borders
     */
    | 'leftBorders'
    /**
     * Apply border format to right borders
     */
    | 'rightBorders'
    /**
     * Apply border format to top borders
     */
    | 'topBorders'
    /**
     * Apply border format to bottom borders
     */
    | 'bottomBorders'
    /**
     * Apply border format to inside borders
     */
    | 'insideBorders'
    /**
     * Apply border format to outside borders
     */
    | 'outsideBorders';
