import { getColor, setColor } from '../utils/color';
import type { FormatHandler } from '../FormatHandler';
import type { TextColorFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textColorFormatHandler: FormatHandler<TextColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        parseTextFillColor(format, element);
        const textColor =
            getColor(
                element,
                false /*isBackground*/,
                !!context.isDarkMode,
                context.darkColorHandler
            ) || defaultStyle.color;

        if (textColor && textColor != 'inherit') {
            format.textColor = textColor;
        }
    },
    apply: (format, element, context) => {
        if (format.textFillColor && format.textFillColor != context.implicitFormat.textFillColor) {
            element.style.setProperty('-webkit-text-fill-color', format.textFillColor);
        }
        const implicitColor = context.implicitFormat.textColor;

        if (format.textColor && format.textColor != implicitColor) {
            setColor(
                element,
                format.textColor,
                false /*isBackground*/,
                !!context.isDarkMode,
                context.darkColorHandler
            );
        }
    },
};

/**
 * @internal
 */
export function parseTextFillColor(format: TextColorFormat, element: HTMLElement) {
    const fill = element.style.getPropertyValue('-webkit-text-fill-color');
    if (fill && fill != 'inherit' && fill != 'unset') {
        format.textFillColor = fill == 'initial' ? 'currentcolor' : fill;
    }
}
