import type { FormatHandler } from '../FormatHandler';
import type { PaddingFormat } from 'roosterjs-content-model-types';

const PaddingKeys: (keyof PaddingFormat & keyof CSSStyleDeclaration)[] = [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
];

/**
 * @internal
 */
export const paddingFormatHandler: FormatHandler<PaddingFormat> = {
    parse: (format, element) => {
        PaddingKeys.forEach(key => {
            const value = element.style[key];

            if (value) {
                format[key] = value;
            }
        });
    },
    apply: (format, element) => {
        PaddingKeys.forEach(key => {
            const value = format[key];
            if (value) {
                element.style[key] = value;
            }
        });
    },
};
