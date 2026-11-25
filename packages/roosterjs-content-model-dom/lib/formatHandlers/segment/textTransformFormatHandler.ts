import { shouldSetValue } from '../utils/shouldSetValue';
import type { FormatHandler } from '../FormatHandler';
import type { TextTransformFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textTransformFormatHandler: FormatHandler<TextTransformFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.textTransform || defaultStyle.textTransform;

        if (
            value &&
            ['none', 'uppercase', 'lowercase', 'capitalize'].indexOf(value) >= 0 &&
            shouldSetValue(value, 'none', format.textTransform, defaultStyle.textTransform)
        ) {
            format.textTransform = value;
        }
    },
    apply: (format, element) => {
        if (format.textTransform) {
            element.style.textTransform = format.textTransform;
        }
    },
};
