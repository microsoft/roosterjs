import { FormatHandler } from '../FormatHandler';
import { WidthFormat } from '../../publicTypes/format/formatParts/WidthFormat';

/**
 * @internal
 */
export const widthFormatHandler: FormatHandler<WidthFormat> = {
    parse: (format, element, _, defaultStyle) => {
        const width = element.style.width || defaultStyle.width;

        if (width) {
            format.width = width;
        }
    },
    apply: (format, element) => {
        if (format.width) {
            element.style.width = format.width;
        }
    },
};
