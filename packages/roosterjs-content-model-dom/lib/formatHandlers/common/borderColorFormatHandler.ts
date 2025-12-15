import { adaptColor, getLightModeColor, retrieveElementColor } from '../utils/color';
import { BorderColorKeyMap, BorderKeys } from '../utils/borderKeys';
import { combineBorderValue, extractBorderValues } from '../../domUtils/style/borderValues';
import type { BorderFormat } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

const WIDTH_KEY = 'borderWidth';
const STYLE_KEY = 'borderStyle';

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
                const width = element.style[WIDTH_KEY];
                const style = element.style[STYLE_KEY];
                const borderColor = retrieveElementColor(element, key);

                if (borderColor) {
                    const lightModeColor = getLightModeColor(
                        borderColor,
                        !!context.isDarkMode,
                        context.darkColorHandler
                    );

                    format[key] = combineBorderValue({
                        width,
                        style,
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
