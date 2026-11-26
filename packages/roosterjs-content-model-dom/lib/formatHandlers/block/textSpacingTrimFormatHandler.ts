import type { TextSpacingTrimFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const textSpacingTrimFormatHandler: FormatHandler<TextSpacingTrimFormat> = {
    parse: (format, element) => {
        const value = element.style.getPropertyValue('text-spacing-trim');
        if (value && value != 'inherit' && value != 'unset') {
            format.textSpacingTrim = value == 'initial' ? 'normal' : value;
        }
    },
    apply: (format, element) => {
        if (format.textSpacingTrim) {
            element.style.setProperty('text-spacing-trim', format.textSpacingTrim);
        }
    },
};
