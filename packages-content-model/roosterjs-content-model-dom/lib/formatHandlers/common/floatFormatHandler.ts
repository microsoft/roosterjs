import type { FloatFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const floatFormatHandler: FormatHandler<FloatFormat> = {
    parse: (format, element) => {
        const float = element.style.float || element.getAttribute('align');

        if (float) {
            format.float = float;
        }
    },
    apply: (format, element) => {
        if (format.float) {
            element.style.float = format.float;
        }
    },
};
