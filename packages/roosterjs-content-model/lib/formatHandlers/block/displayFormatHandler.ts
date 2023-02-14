import { DisplayFormat } from '../../publicTypes/format/formatParts/DisplayFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const displayFormatHandler: FormatHandler<DisplayFormat> = {
    parse: (format, element) => {
        const display = element.style.display;
        const flexDirection = element.style.flexDirection;

        if (display) {
            format.display = display;
        }

        if (flexDirection) {
            format.flexDirection = flexDirection;
        }
    },
    apply: (format, element) => {
        if (format.display) {
            element.style.display = format.display;
        }

        if (format.flexDirection) {
            element.style.flexDirection = format.flexDirection;
        }
    },
};
