import { ContentModelTableFormat } from '../../publicTypes/format/ContentModelTableFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const tableIdHandler: FormatHandler<ContentModelTableFormat> = {
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
