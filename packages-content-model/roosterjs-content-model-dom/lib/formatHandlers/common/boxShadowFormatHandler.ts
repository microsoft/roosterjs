import type { BoxShadowFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const boxShadowFormatHandler: FormatHandler<BoxShadowFormat> = {
    parse: (format, element) => {
        if (element.style?.boxShadow) {
            format.boxShadow = element.style.boxShadow;
        }
    },
    apply: (format, element) => {
        if (format.boxShadow) {
            element.style.boxShadow = format.boxShadow;
        }
    },
};
