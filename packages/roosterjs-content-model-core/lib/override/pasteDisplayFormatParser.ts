import type { DisplayFormat, FormatParser } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const pasteDisplayFormatParser: FormatParser<DisplayFormat> = (format, element) => {
    const display = element.style.display;

    if (display && display != 'flex') {
        format.display = display;
    }
};
