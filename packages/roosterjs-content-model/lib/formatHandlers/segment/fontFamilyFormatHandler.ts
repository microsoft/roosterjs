import { FontFamilyFormat } from '../../publicTypes/format/formatParts/FontFamilyFormat';
import { FormatHandler } from '../FormatHandler';

/**
 * @internal
 */
export const fontFamilyFormatHandler: FormatHandler<FontFamilyFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const fontFamily = element.style.fontFamily || defaultStyle.fontFamily;

        if (fontFamily && fontFamily != 'inherit') {
            format.fontFamily = fontFamily;
        }
    },
    apply: (format, element, context) => {
        if (format.fontFamily && format.fontFamily != context.implicitFormat.fontFamily) {
            element.style.fontFamily = format.fontFamily;
        }
    },
};
