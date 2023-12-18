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
     * Inline Start border in format 'width style color'
     * Left border in Left to right languages, right border in right to left languages
     */
    borderInlineStart?: string;

    /**
     * Inline End border in format 'width style color'
     * Right border in Left to right languages, left border in right to left languages
     */
    borderInlineEnd?: string;
};
