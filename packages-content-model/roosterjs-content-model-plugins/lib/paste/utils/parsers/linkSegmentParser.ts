import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

const VARIABLE_PREFIX = 'var(';
const FALLBACK_ANCHOR_COLOR = 'rgb(186, 124, 255)';

/**
 * @internal
 * If we are pasting a link without href, by default the anchor is removed.
 * But this would cause style difference between source and result, so default to WebLinkColor.
 * Another posibility is that the color is using a variable based style, most of the time this variable is not provided in the clipboard
 * So also default to the default link color.
 */
export const linkSegmentParser: FormatParser<ContentModelSegmentFormat> = (
    format,
    element
): void => {
    if (
        element.tagName.toLowerCase() == 'a' &&
        !element.getAttribute('href') &&
        (!format.textColor || format.textColor == element.style.color) &&
        (!element.style.color || element.style.color.startsWith(VARIABLE_PREFIX))
    ) {
        format.textColor = FALLBACK_ANCHOR_COLOR;
    }
};
