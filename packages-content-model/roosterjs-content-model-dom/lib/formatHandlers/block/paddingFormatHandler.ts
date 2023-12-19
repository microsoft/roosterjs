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
    parse: (format, element, _, defaultStyle) => {
        PaddingKeys.forEach(key => {
            let value = element.style[key];
            const defaultValue = defaultStyle[key] ?? '0px';

            if (value == '0') {
                value = '0px';
            }

            if (value && value != defaultValue) {
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
