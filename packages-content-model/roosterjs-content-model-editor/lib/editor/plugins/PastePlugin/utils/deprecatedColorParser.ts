import { BorderFormat, DomToModelContext, FormatParser } from 'roosterjs-content-model-types';
import { BorderKeys, DeprecatedColors } from 'roosterjs-content-model-dom';

const WHITE_COLOR = '#FFFFFF';
const BLACK_COLOR = '#000000';

/**
 * @internal
 */
export const deprecatedBorderColorParser: FormatParser<BorderFormat> = (
    format: BorderFormat,
    element: HTMLElement,
    context: DomToModelContext
): void => {
    BorderKeys.forEach(key => {
        const value = format[key];
        let color: string = '';
        if (
            value &&
            DeprecatedColors.some(dColor => value.indexOf(dColor) > -1 && (color = dColor))
        ) {
            const newValue = value.replace(color, context.isDarkMode ? WHITE_COLOR : BLACK_COLOR);
            format[key] = newValue;
        }
    });
};
