import { ContentModelIdFormat } from '../../publicTypes/format/formatParts/ContentModelIdFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const idFormatHandler: FormatHandler<ContentModelIdFormat> = {
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
