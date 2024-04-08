import type { FormatHandler } from '../FormatHandler';
import type { RotateFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const rotateFormatHandler: FormatHandler<RotateFormat> = {
    parse: (format, element) => {
        const rotate = element.style.rotate;

        if (rotate) {
            format.rotate = rotate;
        }
    },
    apply: (format, element) => {
        if (format.rotate) {
            element.style.rotate = format.rotate;
        }
    },
};
