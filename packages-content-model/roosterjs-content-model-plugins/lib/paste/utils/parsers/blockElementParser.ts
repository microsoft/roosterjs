import type { ContentModelBlockFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const blockElementParser: FormatParser<ContentModelBlockFormat> = (
    format: ContentModelBlockFormat,
    element: HTMLElement
) => {
    if (element.style.backgroundColor) {
        delete format.backgroundColor;
    }
};
