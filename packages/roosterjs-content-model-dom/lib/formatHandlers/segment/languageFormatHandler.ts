import type { FormatHandler } from '../FormatHandler';
import type { LanguageFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const languageFormatHandler: FormatHandler<LanguageFormat> = {
    parse: (format, element) => {
        if (element.hasAttribute('lang')) {
            format.lang = element.getAttribute('lang') || '';
        }
    },
    apply: (format, element, context) => {
        if (format.lang !== undefined && format.lang != context.implicitFormat.lang) {
            element.setAttribute('lang', format.lang);
        }
    },
};
