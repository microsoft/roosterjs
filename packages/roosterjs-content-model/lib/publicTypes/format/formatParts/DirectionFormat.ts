/**
 * Format of direction
 */
export type DirectionFormat = {
    /**
     * Text direction
     */
    direction?: 'ltr' | 'rtl';

    /**
     * Horizontal alignment
     */
    textAlign?: 'start' | 'center' | 'end';

    /**
     * Whether the text align value comes from attribute rather than CSS
     */
    isTextAlignFromAttr?: boolean;

    /**
     * Horizontal alignment of an element
     */
    alignSelf?: 'start' | 'center' | 'end';
};
