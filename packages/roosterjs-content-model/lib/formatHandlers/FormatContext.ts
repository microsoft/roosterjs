import { Coordinates } from 'roosterjs-editor-types';

/**
 * Context of format, used for parse format from HTML element according to current context
 */
export interface FormatContext {
    /**
     * Whether current content is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Zoom scale of the content
     */
    zoomScale: number;

    /**
     * Whether current content is from right to left
     */
    isRightToLeft: boolean;

    /**
     * Calculate color for dark mode
     * @param lightColor Light mode color
     * @returns Dark mode color calculated from lightColor
     */
    getDarkColor?: (lightColor: string) => string;

    /**
     * Is current context under a selection
     */
    isInSelection: boolean;

    /**
     * Regular selection (selection with a highlight background provided by browser)
     */
    regularSelection?: {
        /**
         * Is the selection collapsed
         */
        isSelectionCollapsed?: boolean;

        /**
         * Start container of this selection
         */
        startContainer?: Node;

        /**
         * End container of this selection
         */
        endContainer?: Node;

        /**
         * Start offset of this selection
         */
        startOffset?: number;

        /**
         * End offset of this selection
         */
        endOffset?: number;
    };

    /**
     * Table selection provided by editor
     */
    tableSelection?: {
        /**
         * Table where selection is located
         */
        table: HTMLTableElement;

        /**
         * Coordinate of first selected cell
         */
        firstCell: Coordinates;

        /**
         * Coordinate of last selected cell
         */
        lastCell: Coordinates;
    };

    /**
     * Image selection provided by editor
     */
    imageSelection?: {
        /**
         * Selected image
         */
        image: HTMLImageElement;
    };
}
