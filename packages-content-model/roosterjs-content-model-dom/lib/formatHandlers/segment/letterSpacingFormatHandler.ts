import { shouldSetValue } from '../utils/shouldSetValue';
import type { FormatHandler } from '../FormatHandler';
import type { LetterSpacingFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const letterSpacingFormatHandler: FormatHandler<LetterSpacingFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const letterSpacing = element.style.letterSpacing || defaultStyle.letterSpacing;

        if (
            shouldSetValue(
                letterSpacing,
                'normal',
                format.letterSpacing,
                defaultStyle.letterSpacing
            )
        ) {
            format.letterSpacing = letterSpacing;
        }
    },
    apply: (format, element) => {
        if (format.letterSpacing) {
            element.style.letterSpacing = format.letterSpacing;
        }
    },
};
