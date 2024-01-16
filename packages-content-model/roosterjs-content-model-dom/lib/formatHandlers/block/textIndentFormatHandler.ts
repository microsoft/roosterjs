import type { FormatHandler } from '../FormatHandler';
import type { TextIndentFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textIndentFormatHandler: FormatHandler<TextIndentFormat> = {
    parse: (format, element) => {
        const textIndent = element.style.textIndent;

        if (textIndent) {
            format.textIndent = textIndent;
        }
    },
    apply: (format, element) => {
        if (format.textIndent) {
            element.style.textIndent = format.textIndent;
        }
    },
};
