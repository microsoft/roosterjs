/**
 * @internal
 *  Common data used in the Table Cell Selection Plugin
 */
export const enum tableCellSelectionCommon {
    /**
     * Class applied when to the parent table when table selection
     */
    TABLE_SELECTED = '_tableSelected',
    /**
     * Class applied to each cell selected
     */
    TABLE_CELL_SELECTED = '_tableCellSelected',
    /**
     * Dataset used to store the current color of the cell when is selected
     */
    TEMP_BACKGROUND_COLOR = 'originalBackgroundColor',
    /**
     * highlight color to apply to the selected cells
     */
    HIGHLIGHT_COLOR = 'rgba(198,198,198,0.7)',
}
