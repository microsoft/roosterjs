import { FormatHandler } from '../FormatHandler';
import { IdFormat } from '../../publicTypes/format/formatParts/IdFormat';

/**
 * @internal
 */
export const idFormatHandler: FormatHandler<IdFormat> = {
    parse: (format, element) => {
        if (element.id) {
            format.id = element.id;
        }
    },
    apply: (format, element) => {
        if (format.id) {
            element.id = format.id;
        }
    },
};
