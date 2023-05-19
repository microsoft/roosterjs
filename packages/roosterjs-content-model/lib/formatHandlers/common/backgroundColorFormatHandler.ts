import { BackgroundColorFormat } from '../../publicTypes/format/formatParts/BackgroundColorFormat';
import { FormatHandler } from '../FormatHandler';
import { getColor, setColor } from '../utils/color';

/**
 * @internal
 */
export const backgroundColorFormatHandler: FormatHandler<BackgroundColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const backgroundColor =
            getColor(
                element,
                true /*isBackground*/,
                context.darkColorHandler,
                context.isDarkMode
            ) || defaultStyle.backgroundColor;

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
                context.darkColorHandler,
                context.isDarkMode
            );
        }
    },
};
