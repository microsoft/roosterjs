import type { FormatHandler } from '../FormatHandler';
import type { TitleFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const titleFormatHandler: FormatHandler<TitleFormat> = {
    parse: (format, element) => {
        if (element.title) {
            format.title = element.title;
        }
    },
    apply: (format, element) => {
        if (format.title) {
            element.title = format.title;
        }
    },
};
