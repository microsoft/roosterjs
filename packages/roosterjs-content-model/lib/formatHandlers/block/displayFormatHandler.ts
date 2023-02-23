import { DisplayFormat } from '../../publicTypes/format/formatParts/DisplayFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const displayFormatHandler: FormatHandler<DisplayFormat> = {
    parse: (format, element) => {
        const display = element.style.display;

        if (display) {
            format.display = display;
        }
    },
    apply: (format, element) => {
        if (format.display) {
            element.style.display = format.display;
        }
    },
};
