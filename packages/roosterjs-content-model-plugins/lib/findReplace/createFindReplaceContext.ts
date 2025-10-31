import { createHighlightHelper } from './utils/HighlightHelperImpl';
import { FindHighlightStyleKey, ReplaceHighlightStyleKey, ScrollMargin } from './utils/constants';
import type { FindReplaceContext } from './types/FindReplaceContext';

/**
 * Creates a FindReplaceContext object with default values
 * @param win The window object
 * @param scrollMargin Margin size (in pixels) when scrolling to a highlighted item
 * @returns
 */
export function createFindReplaceContext(scrollMargin: number = ScrollMargin): FindReplaceContext {
    return {
        text: null,
        matchCase: false,
        wholeWord: false,
        ranges: [],
        markedIndex: -1,
        scrollMargin,
        findHighlight: createHighlightHelper(FindHighlightStyleKey),
        replaceHighlight: createHighlightHelper(ReplaceHighlightStyleKey),
    };
}
