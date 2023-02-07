import { FormatHandler } from '../FormatHandler';
import { ListPositionTypeFormat } from '../../publicTypes/format/formatParts/ListPositionTypeFormat';

/**
 * @internal
 */
export const listPositionTypeFormatHandler: FormatHandler<ListPositionTypeFormat> = {
    parse: (format, element) => {
        if (element.style.listStylePosition) {
            format.listPositionType = element.style.listStylePosition;
        }
    },
    apply: (format, element) => {
        if (format.listPositionType) {
            element.style.listStylePosition = format.listPositionType;
        }
    },
};
