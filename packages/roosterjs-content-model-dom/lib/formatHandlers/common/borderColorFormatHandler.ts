import { adaptColor, getLightModeColor, retrieveElementColor } from '../utils/color';
import { BorderKeys } from '../utils/borderKeys';
import { combineBorderValue, extractBorderValues } from '../../domUtils/style/borderValues';
import type { BorderFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

const COLOR_VARIABLE_PREFIX = 'var(';

/**
 * @internal
 */
export const borderColorFormatHandler: FormatHandler<BorderFormat> = {
    parse: (format, element, context) => {
        if (
            context.experimentalFeatures &&
            context.experimentalFeatures.indexOf('TransformTableBorderColors') > -1
        ) {
            BorderKeys.forEach(key => {
                const value = element.style[key];
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
        }
    },
    apply: (format, element, context) => {
        if (
            context.experimentalFeatures &&
            context.experimentalFeatures.indexOf('TransformTableBorderColors') > -1
        ) {
            BorderKeys.forEach(key => {
                const value = format[key];
                if (value) {
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
            });
        }
    },
};
