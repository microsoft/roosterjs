import { BackgroundColorFormat } from '../../publicTypes/format/formatParts/BackgroundColorFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const backgroundColorFormatHandler: FormatHandler<BackgroundColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const backgroundColor =
            context.darkColorHandler.getColor(element, true /*isBackground*/) ||
            defaultStyle.backgroundColor;

        if (backgroundColor) {
            format.backgroundColor = backgroundColor;
        }
    },
    apply: (format, element, context) => {
        if (format.backgroundColor) {
            context.darkColorHandler.setColor(
                element,
                true /*isBackground*/,
                format.backgroundColor
            );
        }
    },
};
