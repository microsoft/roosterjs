import type { FormatParser, WhiteSpaceFormat } from 'roosterjs-content-model-types';

const WhiteSpacePre = 'pre';

export const pasteWhiteSpaceFormatParser: FormatParser<WhiteSpaceFormat> = (
    format,
    element,
    context,
    defaultStyle
) => {
    if (element.style.whiteSpace != WhiteSpacePre) {
        context.defaultFormatParsers.whiteSpace?.(format, element, context, defaultStyle);
    }
};
