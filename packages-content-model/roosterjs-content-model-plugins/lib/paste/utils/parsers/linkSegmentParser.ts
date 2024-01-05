import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

const VARIABLE_PREFIX = 'var(';
const WEBLINK_COLOR = 'rgb(0, 0, 238)';

/**
 * @internal
 * If we are pasting a link without href, by default the anchor is removed.
 * But this would cause style difference between source and result, so default to WebLinkColor.
 * Another posibility is that the color is using a variable based style, most of the time this variable is not provided in the clipboard
 * So also default to the default link color.
 */
export const linkSegmentParser: FormatParser<ContentModelSegmentFormat> = (
    format: ContentModelSegmentFormat,
    element: HTMLElement
): void => {
    if (
        !format.textColor &&
        element.tagName.toLowerCase() == 'a' &&
        !element.getAttribute('href') &&
        (!element.style.color || element.style.color.startsWith(VARIABLE_PREFIX))
    ) {
        format.textColor = WEBLINK_COLOR;
    }
};
