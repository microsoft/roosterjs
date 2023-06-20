import { FormatHandler } from '../FormatHandler';
import { WordBreakFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const wordBreakFormatHandler: FormatHandler<WordBreakFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const wordBreak = element.style.wordBreak || defaultStyle.wordBreak;

        if (wordBreak) {
            format.wordBreak = wordBreak;
        }
    },
    apply: (format, element) => {
        if (format.wordBreak) {
            element.style.wordBreak = format.wordBreak;
        }
    },
};
