import { combineBorderValue, extractBorderValues } from '../../domUtils/style/borderValues';
import { getColorInternal, setColorOnBorder } from '../utils/color';
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
    parse: (format, element, context, defaultStyle) => {
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

            const borderValues = extractBorderValues(format[key]);
            if (borderValues.color) {
                const color = getColorInternal(
                    borderValues.color,
                    false,
                    !!context.isDarkMode,
                    context.darkColorHandler
                );
                format[key] = combineBorderValue({
                    ...borderValues,
                    color,
                });
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
    apply: (format, element, context) => {
        AllKeys.forEach(key => {
            const value = format[key];
            if (value) {
                setColorOnBorder(
                    element,
                    key,
                    value,
                    !!context.isDarkMode,
                    context.darkColorHandler
                );
            }
        });

        if (format.borderRadius) {
            element.style.borderRadius = format.borderRadius;
        }
    },
};
