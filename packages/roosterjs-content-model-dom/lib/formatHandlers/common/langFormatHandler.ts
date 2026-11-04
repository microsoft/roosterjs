import type { FormatHandler } from '../FormatHandler';
import type { LangFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const langFormatHandler: FormatHandler<LangFormat> = {
    parse: (format, element) => {
        const lang = element.getAttribute('lang');

        if (lang !== null) {
            format.lang = lang;
        }
    },
    apply: (format, element) => {
        if (format.lang !== undefined) {
            element.setAttribute('lang', format.lang);
        }
    },
};
