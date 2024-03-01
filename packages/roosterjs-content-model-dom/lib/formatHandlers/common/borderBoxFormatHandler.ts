import type { BorderBoxFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const borderBoxFormatHandler: FormatHandler<BorderBoxFormat> = {
    parse: (format, element) => {
        if (element.style?.boxSizing == 'border-box') {
            format.useBorderBox = true;
        }
    },
    apply: (format, element) => {
        if (format.useBorderBox) {
            element.style.boxSizing = 'border-box';
        }
    },
};
