import type { ContentModelSegmentFormat, FormatParser } from 'roosterjs-content-model-types';

const VAR_PREFIX = 'var(';
const START_BRACKET = '(';
const END_BRACKET = ')';
const COMMA = ',';
const TWO_DASHES = '--';

/**
 * @internal
 */
export const pasteTextColorFormatParser: FormatParser<ContentModelSegmentFormat> = (
    format,
    element,
    context,
    defaultStyle
): void => {
    if (!isVariableBasedStyle(element)) {
        context.defaultFormatParsers.textColor?.(format, element, context, defaultStyle);
    }
};

function isVariableBasedStyle(element: HTMLElement) {
    const color = element.style.color;
    return (
        color.startsWith(VAR_PREFIX) &&
        color
            .substring(color.indexOf(START_BRACKET) + 1, color.lastIndexOf(END_BRACKET))
            .split(COMMA)
            .every(variable => variable.trim().startsWith(TWO_DASHES))
    );
}
