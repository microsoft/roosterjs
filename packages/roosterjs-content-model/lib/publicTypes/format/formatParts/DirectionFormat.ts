/**
 * Format of direction
 */
export type DirectionFormat = {
    /**
     * Text direction
     */
    direction?: 'ltr' | 'rtl';

    /**
     * Horizontal alignment, from CSS "text-align"
     */
    textAlign?: 'start' | 'center' | 'end' | 'justify' | 'initial';

    /**
     * Horizontal alignment, from HTML attribute "align"
     */
    htmlAlign?: 'start' | 'center' | 'end' | 'justify' | 'initial';
};
