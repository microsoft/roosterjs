import type { FormatHandler } from '../FormatHandler';
import type { ListStyleFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const listStyleFormatHandler: FormatHandler<ListStyleFormat> = {
    parse: (format, element) => {
        const listStylePosition = element.style.listStylePosition;
        const listStyleType = element.style.listStyleType;

        if (listStylePosition) {
            format.listStylePosition = listStylePosition;
        }

        if (listStyleType) {
            format.listStyleType = listStyleType;
        }
    },
    apply: (format, element) => {
        if (format.listStylePosition) {
            element.style.listStylePosition = format.listStylePosition;
        }

        if (format.listStyleType) {
            element.style.listStyleType = format.listStyleType;
        }
    },
};
