import { adaptColor, getLightModeColor, retrieveElementColor } from '../utils/color';
import { BorderColorKeyMap, BorderKeys } from '../utils/borderKeys';
import { combineBorderValue, extractBorderValues } from '../../domUtils/style/borderValues';
import type { BorderFormat, BorderKey } from 'roosterjs-content-model-types';
import type { FormatHandler } from '../FormatHandler';

/**
 * Keys of border width
 */
const BorderWidthKeyMap: {
    [key in BorderKey]: string;
} = {
    borderTop: 'border-top-width',
    borderRight: 'border-right-width',
    borderBottom: 'border-bottom-width',
    borderLeft: 'border-left-width',
};

/**
 * Keys of border styles
 */
const BorderStyleKeyMap: {
    [key in BorderKey]: string;
} = {
    borderTop: 'border-top-style',
    borderRight: 'border-right-style',
    borderBottom: 'border-bottom-style',
    borderLeft: 'border-left-style',
};

const DEFAULT_COLOR = '#000000';

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
                const width = element.style.getPropertyValue(BorderWidthKeyMap[key]);
                const style = element.style.getPropertyValue(BorderStyleKeyMap[key]);
                const color = retrieveElementColor(element, key);
                const borderColor = color == 'initial' ? DEFAULT_COLOR : color;

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
                    const borderColorProperty = BorderColorKeyMap[key];
                    if (borderValues.color) {
                        const transformedColor = adaptColor(
                            element,
                            borderValues.color,
                            'border',
                            !!context.isDarkMode,
                            context.darkColorHandler
                        );
                        if (transformedColor) {
                            element.style.setProperty(borderColorProperty, transformedColor);
                        }
                    }
                }
            });
        }
    },
};
