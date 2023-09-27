import type { FormatHandler } from '../FormatHandler';
import type { ListStylePositionFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const listStylePositionFormatHandler: FormatHandler<ListStylePositionFormat> = {
    parse: (format, element) => {
        const listStylePosition = element.style.listStylePosition;

        if (listStylePosition) {
            format.listStylePosition = listStylePosition;
        }
    },
    apply: (format, element) => {
        if (format.listStylePosition) {
            element.style.listStylePosition = format.listStylePosition;
        }
    },
};
