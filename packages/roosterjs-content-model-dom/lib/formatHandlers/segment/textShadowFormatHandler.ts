import type { FormatHandler } from '../FormatHandler';
import type { TextShadowFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textShadowFormatHandler: FormatHandler<TextShadowFormat> = {
    parse: (format, element) => {
        const value = element.style.textShadow;
        if (value && value != 'inherit' && value != 'unset') {
            format.textShadow = value == 'initial' ? 'none' : value;
        }
    },
    apply: (format, element, context) => {
        if (format.textShadow && format.textShadow != context.implicitFormat.textShadow) {
            element.style.textShadow = format.textShadow;
        }
    },
};
