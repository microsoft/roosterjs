import type { PaginationFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

const properties = [
    ['breakBefore', 'pageBreakBefore'],
    ['breakAfter', 'pageBreakAfter'],
    ['breakInside', 'pageBreakInside'],
] as const;

/**
 * @internal
 */
export const paginationFormatHandler: FormatHandler<PaginationFormat> = {
    parse: (format, element, _, defaultStyle) => {
        properties.forEach(([property, legacy]) => {
            const value = element.style[property] || defaultStyle[property] || defaultStyle[legacy];

            if (value == 'inherit') {
                return;
            } else if (value) {
                format[property] =
                    value == 'initial' || value == 'unset'
                        ? 'auto'
                        : value == 'always'
                        ? 'page'
                        : value;
            } else {
                // Fragmentation rules do not implicitly inherit onto child blocks.
                delete format[property];
            }
        });
    },
    apply: (format, element) => {
        properties.forEach(([property]) => {
            if (format[property]) {
                element.style[property] = format[property]!;
            }
        });
    },
};
