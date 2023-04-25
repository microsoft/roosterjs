import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';

// According to https://developer.mozilla.org/en-US/docs/Web/CSS/white-space, these style values will need to preserve white spaces
const WHITESPACE_PRE_VALUES = ['pre', 'pre-wrap', 'break-spaces'];

/**
 * @internal
 */
export function isWhiteSpacePreserved(paragraph: ContentModelParagraph): boolean {
    return (
        (paragraph.format.whiteSpace &&
            WHITESPACE_PRE_VALUES.indexOf(paragraph.format.whiteSpace) >= 0) ||
        false
    );
}
