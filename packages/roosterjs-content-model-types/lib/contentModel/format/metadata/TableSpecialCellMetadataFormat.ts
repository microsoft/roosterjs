/**
 * Customization options for a header row or first column in a table.
 */
export type TableSpecialCellMetadataFormat = {
    /**
     * Font weight for the cells. Defaults to 'bold' when not specified.
     */
    fontWeight?: string;

    /**
     * If the font style should be italic.
     */
    italic?: boolean;

    /**
     * Top border color for the cells.
     */
    borderTopColor?: string;

    /**
     * Right border color for the cells.
     */
    borderRightColor?: string;

    /**
     * Bottom border color for the cells.
     */
    borderBottomColor?: string;

    /**
     * Left border color for the cells.
     */
    borderLeftColor?: string;

    /**
     * The alignment of the cell
     */
    textAlign?: 'start' | 'center' | 'end' | 'justify' | 'initial';

    /**
     * The cell background color
     */
    backgroundColor?: string;
};
