import type { BorderFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * Keys of border items
 */
export const BorderKeys: (keyof BorderFormat & keyof CSSStyleDeclaration)[] = [
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
];

// This array needs to match BorderKeys array
const BorderWidthKeys: (keyof CSSStyleDeclaration)[] = [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
];

/**
 * @internal
 */
export const borderFormatHandler: FormatHandler<BorderFormat> = {
    parse: (format, element, _, defaultStyle) => {
        BorderKeys.forEach((key, i) => {
            const value = element.style[key];
            const defaultWidth = defaultStyle[BorderWidthKeys[i]] ?? '0px';
            let width = element.style[BorderWidthKeys[i]];

            if (width == '0') {
                width = '0px';
            }

            if (value && width != defaultWidth) {
                format[key] = value == 'none' ? '' : value;
            }
        });

        const borderRadius = element.style.borderRadius;

        if (borderRadius) {
            format.borderRadius = borderRadius;
        }
    },
    apply: (format, element) => {
        BorderKeys.forEach(key => {
            const value = format[key];

            if (value) {
                element.style[key] = value;
            }
        });
    },
};
