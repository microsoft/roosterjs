import { FormatHandler } from '../FormatHandler';
import { TextColorFormat } from '../../publicTypes/format/formatParts/TextColorFormat';

/**
 * @internal
 */
export const textColorFormatHandler: FormatHandler<TextColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textColor =
            context.darkColorHandler.getColor(element, false /*isBackground*/) ||
            defaultStyle.color;

        if (textColor && textColor != 'inherit') {
            format.textColor = textColor;
        }
    },
    apply: (format, element, context) => {
        const implicitColor = context.implicitFormat.textColor;

        if (format.textColor && format.textColor != implicitColor) {
            context.darkColorHandler.setColor(element, false /*isBackground*/, format.textColor);
        }
    },
};
