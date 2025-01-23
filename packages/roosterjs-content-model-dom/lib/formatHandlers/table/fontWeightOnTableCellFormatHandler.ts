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
        // If the element is a TH, remove the font weight so it do not override the font weight of the segment
        if (format.fontWeight == 'normal') {
            element.style.fontWeight = 'normal';
        }
    },
};
