import type { ContentModelBlockFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 * For block elements that have background color style, remove the background color when user selects the merge current format
 * paste option
 */
export const blockElementParser: FormatParser<ContentModelBlockFormat> = (
    format: ContentModelBlockFormat,
    element: HTMLElement
) => {
    if (element.style.backgroundColor) {
        delete format.backgroundColor;
    }
};
