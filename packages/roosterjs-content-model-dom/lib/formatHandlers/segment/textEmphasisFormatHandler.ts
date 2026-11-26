import type { FormatHandler } from '../FormatHandler';
import type { TextEmphasisFormat } from 'roosterjs-content-model-types';

const properties = ['textEmphasisStyle', 'textEmphasisPosition', 'textEmphasisColor'] as const;
const defaults: Required<TextEmphasisFormat> = {
    textEmphasisStyle: 'none',
    textEmphasisPosition: 'over right',
    textEmphasisColor: 'currentcolor',
};

/**
 * @internal
 */
export const textEmphasisFormatHandler: FormatHandler<TextEmphasisFormat> = {
    parse: (format, element, _, defaultStyle) => {
        for (const property of properties) {
            const value = element.style[property] || defaultStyle[property];
            if (value && value != 'inherit' && value != 'unset') {
                format[property] = value;
            }
        }
    },
    apply: (format, element, context) => {
        for (const property of properties) {
            if (format[property] != context.implicitFormat[property]) {
                element.style[property] = format[property] || defaults[property];
            }
        }
    },
};
