import type { FormatHandler } from '../FormatHandler';
import type { ListStyleFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const listStyleFormatHandler: FormatHandler<ListStyleFormat> = {
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
