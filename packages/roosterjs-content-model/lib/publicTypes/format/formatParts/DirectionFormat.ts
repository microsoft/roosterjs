/**
 * Format of direction
 */
export type DirectionFormat = {
    /**
     * Text direction
     */
    direction?: 'ltr' | 'rtl' | 'column';

    /**
     * Horizontal alignment
     */
    textAlign?: 'start' | 'center' | 'end';

    /**
     * Whether the text align value comes from attribute rather than CSS
     */
    isTextAlignFromAttr?: boolean;
};
