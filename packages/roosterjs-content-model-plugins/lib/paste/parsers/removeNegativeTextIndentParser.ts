import type { FormatParser, TextIndentFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const removeNegativeTextIndentParser: FormatParser<TextIndentFormat> = format => {
    if (format.textIndent?.startsWith('-')) {
        delete format.textIndent;
    }
};
