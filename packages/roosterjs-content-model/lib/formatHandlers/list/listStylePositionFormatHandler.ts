import { FormatHandler } from '../FormatHandler';
import { ListStylePositionFormat } from '../../publicTypes/format/formatParts/ListStylePositionFormat';

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
