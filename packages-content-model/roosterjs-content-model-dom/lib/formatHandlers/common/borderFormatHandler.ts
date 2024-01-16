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

const BorderRadiusKeys: (keyof BorderFormat & keyof CSSStyleDeclaration)[] = [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
];

const AllKeys = BorderKeys.concat(BorderRadiusKeys);

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
        } else {
            BorderRadiusKeys.forEach(key => {
                const value = element.style[key];

                if (value) {
                    format[key] = value;
                }
            });
        }
    },
    apply: (format, element) => {
        AllKeys.forEach(key => {
            const value = format[key];

            if (value) {
                element.style[key] = value;
            }
        });

        if (format.borderRadius) {
            element.style.borderRadius = format.borderRadius;
        }
    },
};
