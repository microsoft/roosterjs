/**
 * Selectors for Table Selection
 */
export const enum TableMetadata {
    /**
     * Opacity Applied when selecting a table cell
     */
    SELECTION_COLOR_OPACITY = 0.7,
    /**
     * Data set property to indicate that the selection is cached
     */
    ON_FOCUS_CACHE = 'onFocusCache',
    /**
     * Class applied to table cell selected
     */
    TABLE_CELL_SELECTED = '_tableCellSelected',
    /**
     * Class applied to table cell not selected
     */
    TABLE_CELL_NOT_SELECTED = '_tableCellNotSelected',
    /**
     * Data set applied on a selected table cell to store the original background color
     */
    TEMP_BACKGROUND_COLOR = 'originalBackgroundColor',
    /**
     * Table cell selector
     */
    TABLE_CELL_SELECTOR = 'td,th',
}
