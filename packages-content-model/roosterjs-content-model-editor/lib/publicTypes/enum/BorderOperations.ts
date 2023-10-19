/**
 * All Border operations
 */
export type BorderOperations =
    /**
     * Apply border format to all borders
     */
    | 'AllBorders'
    /**
     * Remove al borders
     */
    | 'NoBorders'
    /**
     * Apply border format to left borders
     */
    | 'LeftBorders'
    /**
     * Apply border format to right borders
     */
    | 'RightBorders'
    /**
     * Apply border format to top borders
     */
    | 'TopBorders'
    /**
     * Apply border format to bottom borders
     */
    | 'BottomBorders'
    /**
     * Apply border format to inside borders
     */
    | 'InsideBorders'
    /**
     * Apply border format to outside borders
     */
    | 'OutsideBorders';
