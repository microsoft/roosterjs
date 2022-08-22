import { FormatHandler } from '../FormatHandler';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';

/**
 * @internal
 */
export const marginFormatHandler: FormatHandler<MarginFormat> = {
    parse: (format, element) => {
        const margin = element.style.margin;

        if (margin) {
            format.margin = element.style.margin;
        }
    },
    apply: (format, element) => {
        if (format.margin) {
            element.style.margin = format.margin;
        }
    },
};
