import { BackgroundColorFormat } from '../../publicTypes/format/formatParts/BackgroundColorFormat';
import { FormatHandler } from '../FormatHandler';
import { getColor, setColor } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const backgroundColorFormatHandler: FormatHandler<BackgroundColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const backgroundColor =
            getColor(element, true /*isBackground*/, context.darkColorHandler) ||
            defaultStyle.backgroundColor;

        if (backgroundColor) {
            format.backgroundColor = backgroundColor;
        }
    },
    apply: (format, element, context) => {
        if (format.backgroundColor) {
            setColor(
                element,
                format.backgroundColor,
                true /*isBackground*/,
                false /*isDarkMode*/,
                format.adjustTextColor,
                context.darkColorHandler
            );
        }
    },
};
