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
     * Color to be applied in all borders
     */
    borderColor?: string;

    /**
     * Width to be applied in all borders
     */
    borderWidth?: string;

    /**
     * Style to be applied in all borders in format 'width style color'
     */
    borderStyle?: string;
};
