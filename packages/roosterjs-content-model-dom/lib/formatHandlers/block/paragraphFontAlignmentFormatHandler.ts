import type { FormatHandler } from '../FormatHandler';
import type { ParagraphFontAlignmentFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const paragraphFontAlignmentFormatHandler: FormatHandler<ParagraphFontAlignmentFormat> = {
    parse: (format, element) => {
        const value = element.style.getPropertyValue('--rooster-paragraph-font-align').trim();
        if (value == 'top' || value == 'middle' || value == 'baseline' || value == 'bottom') {
            format.paragraphFontAlignment = value;
        }
    },
    apply: (format, element) => {
        if (format.paragraphFontAlignment) {
            element.style.setProperty(
                '--rooster-paragraph-font-align',
                format.paragraphFontAlignment
            );
        }
    },
};
