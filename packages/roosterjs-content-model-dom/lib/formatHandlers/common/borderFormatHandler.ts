import { adaptColor, getLightModeColor, retrieveElementColor } from '../utils/color';
import { BorderKeys } from '../utils/borderKeys';
import { combineBorderValue, extractBorderValues } from '../../domUtils/style/borderValues';
import type { BorderFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

const COLOR_VARIABLE_PREFIX = 'var(';

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

const AllKeys = BorderRadiusKeys.concat(BorderKeys);

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

            if (value?.includes(COLOR_VARIABLE_PREFIX)) {
                const borderColor = retrieveElementColor(element, key);
                if (borderColor) {
                    const lightModeColor = getLightModeColor(
                        borderColor,
                        false /*isBackground*/,
                        !!context.isDarkMode,
                        context.darkColorHandler
                    );

                    format[key] = combineBorderValue({
                        ...extractBorderValues(value),
                        color: lightModeColor,
                    });
                }
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
                element.style[key] = value;
                if (!BorderRadiusKeys.includes(key) && !BorderWidthKeys.includes(key)) {
                    const borderValues = extractBorderValues(value);
                    if (borderValues.color) {
                        const transformedColor = adaptColor(
                            element,
                            borderValues.color,
                            'border',
                            !!context.isDarkMode,
                            context.darkColorHandler
                        );
                        const borderStyles = combineBorderValue({
                            ...borderValues,
                            color: transformedColor,
                        });
                        element.style[key] = borderStyles;
                    }
                }
            }
        });

        if (format.borderRadius) {
            element.style.borderRadius = format.borderRadius;
        }
    },
};
