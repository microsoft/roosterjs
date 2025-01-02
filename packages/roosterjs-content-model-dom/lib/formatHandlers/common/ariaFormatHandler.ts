import type { AriaFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const ariaFormatHandler: FormatHandler<AriaFormat> = {
    parse: (format, element) => {
        const ariaDescribedBy = element.getAttribute('aria-describedby');
        const title = element.getAttribute('title');
        if (ariaDescribedBy) {
            format.ariaDescribedBy = ariaDescribedBy;
        }
        if (title) {
            format.title = title;
        }
    },
    apply: (format, element) => {
        if (format.ariaDescribedBy) {
            element.setAttribute('aria-describedby', format.ariaDescribedBy);
        }
        if (format.title) {
            element.setAttribute('title', format.title);
        }
    },
};
