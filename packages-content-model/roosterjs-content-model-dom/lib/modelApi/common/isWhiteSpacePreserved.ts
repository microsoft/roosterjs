import { ContentModelParagraph } from 'roosterjs-content-model-types';

// According to https://developer.mozilla.org/en-US/docs/Web/CSS/white-space, these style values will need to preserve white spaces
const WHITESPACE_PRE_VALUES = ['pre', 'pre-wrap', 'break-spaces'];

/**
 * Check if we have white-space to be preserved for a given paragraph
 * @param paragraph The paragraph to check
 */
export function isWhiteSpacePreserved(paragraph: ContentModelParagraph): boolean {
    return (
        (paragraph.format.whiteSpace &&
            WHITESPACE_PRE_VALUES.indexOf(paragraph.format.whiteSpace) >= 0) ||
        false
    );
}
