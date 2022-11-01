import { DefaultLinkColorPlaceholder } from '../../domToModel/context/defaultStyles';
import { FormatHandler } from '../FormatHandler';
import { getColor, setColor } from '../utils/color';
import { TextColorFormat } from '../../publicTypes/format/formatParts/TextColorFormat';

/**
 * @internal
 */
export const textColorFormatHandler: FormatHandler<TextColorFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textColor =
            getColor(element, false /*isBackground*/, context.isDarkMode) || defaultStyle.color;

        if (textColor && textColor != 'inherit') {
            format.textColor = textColor;
        }
    },
    apply: (format, element, context) => {
        const isLink = element.tagName == 'A';

        if (format.textColor && (!isLink || format.textColor != DefaultLinkColorPlaceholder)) {
            setColor(
                element,
                format.textColor,
                false /*isBackground*/,
                context.isDarkMode,
                context.getDarkColor
            );
        }
    },
};
