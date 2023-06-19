import { FormatHandler } from '../FormatHandler';
import { getColor, setColor } from 'roosterjs-editor-dom';
import { TextColorFormat } from '../../publicTypes/format/formatParts/TextColorFormat';

/**
 * @internal
 */
export const textColorFormatHandler: FormatHandler<TextColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textColor =
            getColor(element, false /*isBackground*/, context.darkColorHandler) ||
            defaultStyle.color;

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
                false /*isDarkModel*/,
                false /*adjustTextColor*/,
                context.darkColorHandler
            );
        }
    },
};
