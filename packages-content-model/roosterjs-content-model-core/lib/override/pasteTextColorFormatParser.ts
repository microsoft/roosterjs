import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

const VAR_PREFIX = 'var(';

/**
 * @internal
 */
export const pasteTextColorFormatParser: FormatParser<ContentModelSegmentFormat> = (
    format,
    element,
    context,
    defaultStyle
): void => {
    if (!element.style.color.startsWith(VAR_PREFIX)) {
        context.defaultFormatParsers.textColor?.(format, element, context, defaultStyle);
    }
};
