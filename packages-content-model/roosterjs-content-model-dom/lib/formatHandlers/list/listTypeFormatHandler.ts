import { FormatHandler } from '../FormatHandler';
import { ListTypeFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const listTypeFormatHandler: FormatHandler<ListTypeFormat> = {
    parse: (format, element) => {
        const tag = element.tagName;

        if (tag == 'OL' || tag == 'UL') {
            format.listType = tag;
        }
    },
    apply: () => {},
};
