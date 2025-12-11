import { adaptColor, getLightModeColor, retrieveElementColor } from '../utils/color';
import { BorderColorKeyMap, BorderKeys } from '../utils/borderKeys';
import { combineBorderValue, extractBorderValues } from '../../domUtils/style/borderValues';
import type { BorderFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

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
                const borderColor = retrieveElementColor(element, key);

                if (borderColor) {
                    const lightModeColor = getLightModeColor(
                        borderColor,
                        false /*isBackground*/,
                        !!context.isDarkMode,
                        context.darkColorHandler
                    );
                    const borderValues = extractBorderValues(value);
                    format[key] = combineBorderValue({
                        width: borderValues?.width || '1px',
                        style: borderValues?.style || 'solid',
                        color: lightModeColor,
                    });
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
                        if (transformedColor) {
                            const borderColorProperty = BorderColorKeyMap[key];
                            element.style.setProperty(borderColorProperty, transformedColor);
                        }
                    }
                }
            });
        }
    },
};
