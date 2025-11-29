import type { HighlightHelper } from './HighlightHelper';

/**
 * Represents a context object used by all find/replace operations
 */
export interface FindReplaceContext {
    /**
     * Text to find (null means no find)
     */
    text: string | null;

    /**
     * Whether to match case when finding text
     */
    matchCase: boolean;

    /**
     * Whether to match whole word when finding text
     */
    wholeWord: boolean;

    /**
     * Ranges of found results
     */
    ranges: Range[];

    /**
     * Current marked index in the ranges array
     */
    markedIndex: number;

    /**
     * Margin size (in pixels) when scrolling to a highlighted item
     */
    readonly scrollMargin: number;

    /**
     * Highlight helper used to highlight found results
     */
    readonly findHighlight: HighlightHelper;

    /**
     * Highlight helper used to highlight the current marked result
     */
    readonly replaceHighlight: HighlightHelper;
}
