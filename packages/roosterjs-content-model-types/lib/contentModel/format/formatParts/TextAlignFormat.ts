/**
 * Format of text-align
 */
export type TextAlignFormat = {
    /**
     * Horizontal alignment, from CSS "text-align"
     */
    textAlign?: 'start' | 'center' | 'end' | 'justify' | 'initial';

    /**
     * Alignment of the final line, from CSS "text-align-last"
     */
    textAlignLast?: string;
};
