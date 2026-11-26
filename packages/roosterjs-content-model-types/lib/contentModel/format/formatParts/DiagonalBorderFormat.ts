/**
 * Solid diagonal borders of a table cell, with absolute widths and resolved colors.
 */
export type DiagonalBorderFormat = {
    /**
     * Border from the top-left to the bottom-right corner.
     */
    diagonalDown?: string;
    /**
     * Border from the bottom-left to the top-right corner.
     */
    diagonalUp?: string;
};
