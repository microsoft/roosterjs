import type { FormatHandler } from '../FormatHandler';
import type { LetterSpacingFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const letterSpacingFormatHandler: FormatHandler<LetterSpacingFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const letterSpacing = element.style.letterSpacing || defaultStyle.letterSpacing;

        if (letterSpacing) {
            format.letterSpacing = letterSpacing;
        }
    },
    apply: (format, element, context) => {
        if (format.letterSpacing) {
            element.style.letterSpacing = format.letterSpacing;
        }
    },
};
