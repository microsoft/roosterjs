/**
 * Format of border
 */
export type BorderFormat = {
    /**
     * Top border in format 'width style color'
     */
    borderTop?: string;

    /**
     * Right border in format 'width style color'
     */
    borderRight?: string;

    /**
     * Bottom border in format 'width style color'
     */
    borderBottom?: string;

    /**
     * Left border in format 'width style color'
     */
    borderLeft?: string;

    /**
     * Radius to be applied in all borders corners
     */
    borderRadius?: string;

    /**
     * Radius to be applied in top left corner
     */
    borderTopLeftRadius?: string;

    /**
     * Radius to be applied in top right corner
     */
    borderTopRightRadius?: string;

    /**
     * Radius to be applied in bottom left corner
     */
    borderBottomLeftRadius?: string;

    /**
     * Radius to be applied in bottom right corner
     */
    borderBottomRightRadius?: string;
};
