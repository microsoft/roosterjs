import { shouldSetValue } from '../utils/shouldSetValue';
import type { FormatHandler } from '../FormatHandler';
import type { FontVariantFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const fontVariantFormatHandler: FormatHandler<FontVariantFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const value = element.style.fontVariant || defaultStyle.fontVariant;

        if (
            (value == 'normal' || value == 'small-caps') &&
            shouldSetValue(value, 'normal', format.fontVariant, defaultStyle.fontVariant)
        ) {
            format.fontVariant = value;
        }
    },
    apply: (format, element) => {
        if (format.fontVariant) {
            element.style.fontVariant = format.fontVariant;
        }
    },
};
