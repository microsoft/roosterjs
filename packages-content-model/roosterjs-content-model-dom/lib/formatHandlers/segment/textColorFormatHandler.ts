import { getColor, setColor } from '../utils/color';
import type { FormatHandler } from '../FormatHandler';
import type { TextColorFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textColorFormatHandler: FormatHandler<TextColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
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
