import type { FormatHandler } from '../FormatHandler';
import type { BoldFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const fontWeightOnTableCellFormatHandler: FormatHandler<BoldFormat> = {
    parse: (format, element) => {
        if (element.style.fontWeight == 'normal') {
            format.fontWeight = 'normal';
        }
    },
    apply: (format, element) => {
        if (format.fontWeight == 'normal') {
            element.style.fontWeight = 'normal';
        }
    },
};
