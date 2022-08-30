import { FontSizeFormat } from '../../publicTypes/format/formatParts/FontSizeFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const fontSizeFormatHandler: FormatHandler<FontSizeFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const fontSize = element.style.fontSize || defaultStyle.fontSize;

        if (fontSize) {
            format.fontSize = fontSize;
        }
    },
    apply: (format, element) => {
        if (format.fontSize) {
            element.style.fontSize = format.fontSize;
        }
    },
};
